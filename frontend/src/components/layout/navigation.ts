export type NavItem = {
    href: string;
    label: string;
};

export const NAV_ITEMS: NavItem[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/search-scores", label: "Search Scores" },
    { href: "/reports", label: "Reports" },
    { href: "/settings", label: "Settings" }
];

export function pageTitle(pathname: string): string {
    const match = NAV_ITEMS.find(
        (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    );

    return match?.label ?? "ScoreHub";
}
