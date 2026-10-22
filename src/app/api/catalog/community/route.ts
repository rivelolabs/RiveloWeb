import {NextResponse} from 'next/server';
import {randomUUID} from 'node:crypto';
import {jsonBody,sameOrigin,shortText,validEmail} from '@/lib/catalog/http';
import {rateLimit} from '@/lib/catalog/limit';
import {updateCatalog} from '@/lib/catalog/store';
import {topics} from '@/lib/catalog/community';
import {dbEnabled,upsertProfile} from '@/lib/db';
import {createPost,createReply} from '@/lib/db/community';
import {currentUser} from '@/lib/auth/server';
import {displayName} from '@/lib/auth/profile';
import type {NextRequest} from 'next/server';
export async function POST(request:NextRequest){try{if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin.'},{status:403});rateLimit(request,'community',10);const body=await jsonBody(request);const user=await currentUser(request);if(!user)return NextResponse.json({error:'Sign in to post in the community.',signIn:true},{status:401});
/* Identity always comes from the signed-in X or Google account, never from the form. */
body.email=validEmail(user.email)?user.email:`${user.id}@users.rivelolabs.com`;const author=shortText(displayName(user),60)||'Rivelo member',text=shortText(body.body,2000);if(text.length<10)throw Error('Write a message of at least 10 characters.');if(dbEnabled()){if(user)await upsertProfile(user).catch(()=>{});if(body.postId)await createReply({postId:String(body.postId),authorId:user?.id,author,email:body.email,body:text});else{const title=shortText(body.title,160);if(!topics.includes(body.topic)||title.length<10)throw Error('Choose a topic and add a clear question (10+ characters).');await createPost({authorId:user?.id,author,email:body.email,topic:body.topic,title,body:text});}return NextResponse.json({success:true},{status:201});}await updateCatalog(state=>{const id=randomUUID(),createdAt=new Date().toISOString();if(body.postId){const post=state.posts.find(p=>p.id===body.postId&&p.status==='published');if(!post||post.replies.length>=100)throw Error('This discussion is unavailable.');post.replies.push({id,author,email:body.email,body:text,status:'published',createdAt});}else{const title=shortText(body.title,160);if(!topics.includes(body.topic)||title.length<10)throw Error('Choose a topic and add a clear question (10+ characters).');if(state.posts.length>=2000)throw Error('Community submissions are temporarily full.');state.posts.unshift({id,author,email:body.email,title,body:text,topic:body.topic,status:'published',createdAt,replies:[]});}});return NextResponse.json({success:true},{status:201});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not submit.'},{status:400});}}
