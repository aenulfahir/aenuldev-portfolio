import React, { useEffect, useState } from "react";
import { useData } from "../../context/DataContext";
import { supabase } from "../../lib/supabase";
import {
  Briefcase,
  FileText,
  DollarSign,
  MessageSquare,
  Activity,
  Star,
  ExternalLink,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalOrders: number;
  unreadMessages: number;
  totalComments: number;
}

const Dashboard: React.FC = () => {
  const { projects, blog, pricing, hero } = useData();
  const [extraStats, setExtraStats] = useState<DashboardStats>({
    totalOrders: 0,
    unreadMessages: 0,
    totalComments: 0,
  });
  const [recentActivity, setRecentActivity] = useState<
    Array<{
      type: string;
      title: string;
      description: string;
      time: string;
      color: string;
    }>
  >([]);

  useEffect(() => {
    fetchExtraStats();
    fetchRecentActivity();
  }, []);

  const fetchExtraStats = async () => {
    try {
      // Fetch orders count
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Fetch unread messages count
      const { count: unreadCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      // Fetch total comments count
      const { count: commentsCount } = await supabase
        .from("blog_comments")
        .select("*", { count: "exact", head: true });

      setExtraStats({
        totalOrders: ordersCount || 0,
        unreadMessages: unreadCount || 0,
        totalComments: commentsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const activities: Array<{
        type: string;
        title: string;
        description: string;
        time: string;
        color: string;
        created_at: string;
      }> = [];

      // Fetch recent blog posts
      const { data: recentBlogs } = await supabase
        .from("blog_posts")
        .select("title, created_at")
        .order("created_at", { ascending: false })
        .limit(2);

      recentBlogs?.forEach((blog) => {
        activities.push({
          type: "blog",
          title: "Blog Post Published",
          description: `"${blog.title}"`,
          time: getTimeAgo(blog.created_at),
          color: "var(--secondary-color)",
          created_at: blog.created_at,
        });
      });

      // Fetch recent comments
      const { data: recentComments } = await supabase
        .from("blog_comments")
        .select("user_name, text, created_at")
        .order("created_at", { ascending: false })
        .limit(2);

      recentComments?.forEach((comment) => {
        activities.push({
          type: "comment",
          title: "New Comment",
          description: `${comment.user_name}: "${comment.text.substring(
            0,
            30
          )}..."`,
          time: getTimeAgo(comment.created_at),
          color: "var(--accent-color)",
          created_at: comment.created_at,
        });
      });

      // Fetch recent messages
      const { data: recentMessages } = await supabase
        .from("contact_messages")
        .select("name, created_at")
        .order("created_at", { ascending: false })
        .limit(2);

      recentMessages?.forEach((msg) => {
        activities.push({
          type: "message",
          title: "New Message",
          description: `From ${msg.name}`,
          time: getTimeAgo(msg.created_at),
          color: "var(--primary-color)",
          created_at: msg.created_at,
        });
      });

      // Fetch recent orders
      const { data: recentOrders } = await supabase
        .from("orders")
        .select("customer_name, package_name, created_at")
        .order("created_at", { ascending: false })
        .limit(2);

      recentOrders?.forEach((order) => {
        activities.push({
          type: "order",
          title: "New Order",
          description: `${order.customer_name} - ${order.package_name}`,
          time: getTimeAgo(order.created_at),
          color: "#22c55e",
          created_at: order.created_at,
        });
      });

      // Sort by created_at and take top 5
      activities.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: <Briefcase size={24} />,
      color: "var(--primary-color)",
      link: "/admin/projects",
    },
    {
      label: "Blog Posts",
      value: blog.length,
      icon: <FileText size={24} />,
      color: "var(--secondary-color)",
      link: "/admin/blog",
    },
    {
      label: "Total Orders",
      value: extraStats.totalOrders,
      icon: <ShoppingCart size={24} />,
      color: "#22c55e",
      link: "/admin/contact",
    },
    {
      label: "Unread Messages",
      value: extraStats.unreadMessages,
      icon: <MessageSquare size={24} />,
      color: "var(--accent-color)",
      link: "/admin/contact",
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: "3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            Welcome back,{" "}
            <span className="glow-text">{hero.name.split(" ")[0]}</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            System Status:{" "}
            <span style={{ color: "var(--primary-color)" }}>ONLINE</span> |
            Secure Connection Established
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="glass-panel"
            style={{
              padding: "1.5rem",
              position: "relative",
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                width: "60px",
                height: "60px",
                background: stat.color,
                opacity: 0.1,
                borderRadius: "50%",
                filter: "blur(20px)",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "12px",
                  background: `rgba(255,255,255,0.05)`,
                  color: stat.color,
                  border: `1px solid ${stat.color}40`,
                }}
              >
                {stat.icon}
              </div>
              <TrendingUp size={16} color="var(--text-secondary)" />
            </div>

            <div
              style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* Recent Activity */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Activity size={20} color="var(--primary-color)" /> Recent Activity
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {recentActivity.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-secondary)",
                }}
              >
                No recent activity
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: activity.color,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "bold" }}>{activity.title}</div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {activity.description}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      flexShrink: 0,
                    }}
                  >
                    {activity.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Star size={20} color="var(--accent-color)" /> Quick Actions
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Link
              to="/admin/projects"
              className="btn btn-outline"
              style={{ justifyContent: "space-between" }}
            >
              <span>Add New Project</span>
              <ExternalLink size={16} />
            </Link>
            <Link
              to="/admin/blog"
              className="btn btn-outline"
              style={{ justifyContent: "space-between" }}
            >
              <span>Write Blog Post</span>
              <ExternalLink size={16} />
            </Link>
            <Link
              to="/admin/profile"
              className="btn btn-outline"
              style={{ justifyContent: "space-between" }}
            >
              <span>Update Profile</span>
              <ExternalLink size={16} />
            </Link>
            <Link
              to="/admin/contact"
              className="btn btn-outline"
              style={{ justifyContent: "space-between" }}
            >
              <span>View Messages</span>
              <MessageSquare size={16} />
            </Link>
            <Link
              to="/"
              target="_blank"
              className="btn btn-primary"
              style={{ justifyContent: "center", marginTop: "1rem" }}
            >
              View Live Site
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div
        className="glass-panel"
        style={{ padding: "2rem", marginTop: "2rem" }}
      >
        <h2
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <DollarSign size={20} color="var(--accent-color)" /> Summary
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "var(--primary-color)",
              }}
            >
              {pricing.length}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Pricing Plans
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "var(--secondary-color)",
              }}
            >
              {extraStats.totalComments}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Total Comments
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "var(--accent-color)",
              }}
            >
              {projects.filter((p) => p.type === "web").length}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Web Projects
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#22c55e",
              }}
            >
              {projects.filter((p) => p.type === "mobile").length}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Mobile Projects
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
