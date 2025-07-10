import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { UserIcon, UsersIcon, ShieldCheckIcon, ActivityIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

interface DashboardProps {
    userStats: {
        totalUsers: number;
        newUsersToday: number;
        activeUsers: number;
    };
    roleDistribution: {
        name: string;
        count: number;
        color: string;
    }[];
    recentUsers: {
        id: string;
        username: string;
        email: string;
        role: string;
        created_at: string;
    }[];
    systemActivity: {
        action: string;
        user: string;
        timestamp: string;
        details: string;
    }[];
}

export default function Dashboard({ userStats, roleDistribution, recentUsers, systemActivity }: DashboardProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Total Users Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                +{userStats.newUsersToday} new today
                            </p>
                        </CardContent>
                    </Card>

                    {/* User Roles Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">User Roles</CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col space-y-2">
                                {roleDistribution.map((role) => (
                                    <div key={role.name} className="flex items-center justify-between">
                                        <Badge className={role.color}>{role.name}</Badge>
                                        <span className="text-sm font-medium">{role.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Permissions Card */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
                            <ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userStats.activeUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                Active users in the last 24 hours
                            </p>
                            <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-1"
                                    style={{ width: `${(userStats.activeUsers / userStats.totalUsers) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {Math.round((userStats.activeUsers / userStats.totalUsers) * 100)}% user engagement
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Users Table */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Users</CardTitle>
                            <CardDescription>Recently registered users in the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.username}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user.role}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* System Activity Log */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>System Activity</CardTitle>
                            <CardDescription>Recent system events and activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {systemActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <ActivityIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{activity.action}</p>
                                            <p className="text-sm text-muted-foreground">
                                                By {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{activity.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
