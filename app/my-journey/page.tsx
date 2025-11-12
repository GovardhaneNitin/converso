import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  getUserCompanions,
  getUserSessions,
  getUserBookmarks,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionsList from "@/app/components/CompanionsList";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const bookmarkedCompanions = await getUserBookmarks(user.id);

  // Calculate statistics
  const totalLessonsCompleted = sessionHistory.length;
  const companionsCreated = companions.length;
  const bookmarksCount = bookmarkedCompanions.length;

  return (
    <main className="min-lg:w-3/4">
      {/* Hero Profile Section */}
      <section className="flex flex-col gap-8">
        {/* Profile Header with Background */}
        <div className="relative rounded-3xl border-2 border-black/10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden shadow-lg">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

          <div className="relative px-8 py-10 flex flex-col gap-8">
            {/* User Info */}
            <div className="flex gap-6 items-center">
              <div className="relative flex-shrink-0">
                <Image
                  src={user.imageUrl}
                  alt={user.firstName!}
                  width={140}
                  height={140}
                  className="rounded-2xl border-4 border-white shadow-lg object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Welcome back
                  </p>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    {user.firstName} {user.lastName}
                  </h1>
                </div>
                <p className="text-slate-600 font-medium">
                  {user.emailAddresses[0].emailAddress}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    Active Learner
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {companions.length > 0 ? "Creator" : "Beginner"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-3 w-full max-lg:grid-cols-3">
              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-black/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                    >
                      <polyline points="22 4 2 4 2 16 22 16 22 4"></polyline>
                      <line x1="2" y1="8" x2="22" y2="8"></line>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">
                    {totalLessonsCompleted}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-600">
                  Lessons Completed
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-black/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">
                    {companionsCreated}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-600">
                  Companions Created
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-black/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">
                    {bookmarksCount}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-600">Bookmarked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="w-full">
          <Accordion type="multiple" className="space-y-4">
            {/* Recent Sessions */}
            <AccordionItem
              value="recent"
              className="rounded-2xl border-2 border-black/10 overflow-hidden hover:border-blue-300 transition-colors"
            >
              <AccordionTrigger className="px-6 py-5 hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <path d="M12 1v6m0 6v4"></path>
                      <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"></path>
                      <path d="M1 12h6m6 0h4"></path>
                      <path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl text-slate-900">
                      Recent Sessions
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {totalLessonsCompleted} lessons completed
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-5 bg-gradient-to-b from-blue-50/50 to-transparent">
                {sessionHistory.length > 0 ? (
                  <CompanionsList
                    title="Recent Sessions"
                    companions={sessionHistory}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">
                      No sessions yet. Start learning today!
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Bookmarks */}
            <AccordionItem
              value="bookmarks"
              className="rounded-2xl border-2 border-black/10 overflow-hidden hover:border-amber-300 transition-colors"
            >
              <AccordionTrigger className="px-6 py-5 hover:bg-amber-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl text-slate-900">
                      Bookmarks
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {bookmarksCount} saved for later
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-5 bg-gradient-to-b from-amber-50/50 to-transparent">
                {bookmarkedCompanions.length > 0 ? (
                  <CompanionsList
                    title="Bookmarks"
                    companions={bookmarkedCompanions}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">
                      No bookmarks yet. Bookmark companions to save them!
                    </p>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* My Companions */}
            <AccordionItem
              value="companions"
              className="rounded-2xl border-2 border-black/10 overflow-hidden hover:border-purple-300 transition-colors"
            >
              <AccordionTrigger className="px-6 py-5 hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xl text-slate-900">
                      My Companions
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {companionsCreated} created companions
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-5 bg-gradient-to-b from-purple-50/50 to-transparent">
                {companions.length > 0 ? (
                  <CompanionsList
                    title="My Companions"
                    companions={companions}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-lg mb-4">
                      You haven&apos;t created any companions yet.
                    </p>
                    <Link
                      href="/companions/new"
                      className="inline-block px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Create Your First Companion
                    </Link>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
};
export default Profile;
