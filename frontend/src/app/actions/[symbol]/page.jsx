import SidebarNav from "@/app/components/SidebarNav-Auth";
import SharedActionDetail from "@/app/components/SharedActionDetail";

export default async function ActionDetailPage({ params }) {
  const { symbol } = await params;

  return (
    <SharedActionDetail
      symbol={symbol}
      showSidebar={true}
      SidebarComponent={SidebarNav}
      isPublic={false}
    />
  );
}
