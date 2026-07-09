import Feed from '../components/Feed';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-black">
      {/* This renders your TikTok music sliding feed component */}
      <Feed />
    </div>
  );
}