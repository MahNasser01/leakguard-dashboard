import { useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Star, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock user data (shared with Users page)
interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  department: string;
  leaksDetected: number;
  lastActive: string;
}

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&mood[]=happy",
    department: "Engineering",
    leaksDetected: 12,
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&mood[]=happy",
    department: "Product",
    leaksDetected: 8,
    lastActive: "5 hours ago",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&mood[]=happy",
    department: "Marketing",
    leaksDetected: 23,
    lastActive: "1 day ago",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&mood[]=happy",
    department: "Engineering",
    leaksDetected: 5,
    lastActive: "3 hours ago",
  },
  {
    id: "5",
    name: "Jessica Martinez",
    email: "jessica.martinez@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&mood[]=happy",
    department: "Sales",
    leaksDetected: 15,
    lastActive: "30 minutes ago",
  },
  {
    id: "6",
    name: "Robert Taylor",
    email: "robert.taylor@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&mood[]=happy",
    department: "Engineering",
    leaksDetected: 31,
    lastActive: "1 hour ago",
  },
  {
    id: "7",
    name: "Amanda White",
    email: "amanda.white@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda&mood[]=happy",
    department: "Product",
    leaksDetected: 7,
    lastActive: "4 hours ago",
  },
  {
    id: "8",
    name: "James Wilson",
    email: "james.wilson@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&mood[]=happy",
    department: "Marketing",
    leaksDetected: 19,
    lastActive: "2 days ago",
  },
  {
    id: "9",
    name: "Lisa Anderson",
    email: "lisa.anderson@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&mood[]=happy",
    department: "Engineering",
    leaksDetected: 4,
    lastActive: "6 hours ago",
  },
  {
    id: "10",
    name: "Christopher Brown",
    email: "christopher.brown@company.com",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher&mood[]=happy",
    department: "Sales",
    leaksDetected: 27,
    lastActive: "45 minutes ago",
  },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getLeakBadgeVariant = (leaks: number) => {
  if (leaks === 0) return "secondary";
  if (leaks <= 5) return "default";
  if (leaks <= 15) return "outline";
  return "destructive";
};

export default function Leaderboard() {
  // Leaderboard: sorted by lowest leaks (best performers first)
  const leaderboard = useMemo(() => {
    return [...MOCK_USERS].sort((a, b) => a.leaksDetected - b.leaksDetected);
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3); // Show all remaining users

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Security Champions Leaderboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Top performers with the lowest leak detection rates - celebrating our security champions!
        </p>
      </div>

      {/* Leaderboard Section */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <CardTitle>Top Performers</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Ranked by lowest number of leaks detected
          </p>
        </CardHeader>
        <CardContent>
          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <div className="flex items-end justify-center gap-4 mb-8">
              {/* 2nd Place */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-slate-300">
                    <AvatarImage src={topThree[1].profilePicture} alt={topThree[1].name} />
                    <AvatarFallback>{getInitials(topThree[1].name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-slate-300 rounded-full p-1">
                    <Medal className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-center min-w-[120px]">
                  <div className="font-semibold text-sm">{topThree[1].name}</div>
                  <div className="text-xs text-muted-foreground">{topThree[1].department}</div>
                  <Badge variant="secondary" className="mt-2">
                    {topThree[1].leaksDetected} {topThree[1].leaksDetected === 1 ? "leak" : "leaks"}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-slate-400">#2</div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-yellow-400 shadow-lg shadow-yellow-400/50">
                    <AvatarImage src={topThree[0].profilePicture} alt={topThree[0].name} />
                    <AvatarFallback>{getInitials(topThree[0].name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1">
                    <Trophy className="h-6 w-6 text-yellow-900" />
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center min-w-[140px] border-2 border-yellow-400">
                  <div className="font-bold text-base">{topThree[0].name}</div>
                  <div className="text-xs text-muted-foreground">{topThree[0].department}</div>
                  <Badge variant="default" className="mt-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                    {topThree[0].leaksDetected} {topThree[0].leaksDetected === 1 ? "leak" : "leaks"}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-yellow-500 flex items-center gap-1">
                  <Crown className="h-6 w-6" />
                  #1
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-amber-600">
                    <AvatarImage src={topThree[2].profilePicture} alt={topThree[2].name} />
                    <AvatarFallback>{getInitials(topThree[2].name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-amber-600 rounded-full p-1">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center min-w-[120px]">
                  <div className="font-semibold text-sm">{topThree[2].name}</div>
                  <div className="text-xs text-muted-foreground">{topThree[2].department}</div>
                  <Badge variant="outline" className="mt-2 border-amber-600 text-amber-700 dark:text-amber-400">
                    {topThree[2].leaksDetected} {topThree[2].leaksDetected === 1 ? "leak" : "leaks"}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-amber-600">#3</div>
              </div>
            </div>
          )}

          {/* Rest of Leaderboard */}
          {restOfLeaderboard.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">All Rankings</h3>
              {restOfLeaderboard.map((user, index) => {
                const rank = index + 4;
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-bold text-sm">
                      #{rank}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.department}</div>
                    </div>
                    <Badge variant={getLeakBadgeVariant(user.leaksDetected)}>
                      {user.leaksDetected} {user.leaksDetected === 1 ? "leak" : "leaks"}
                    </Badge>
                    {user.leaksDetected <= 5 && (
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

