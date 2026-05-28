import { redirect } from 'next/navigation';

export default function SubPage({ params }: { params: { slug: string } }) {
  redirect('/admin');
}
