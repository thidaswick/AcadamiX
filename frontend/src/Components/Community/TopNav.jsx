import React from "react";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import { HomeOutlined, TeamOutlined, BellOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';

const TopNav = () => {
  const snap = useSnapshot(state);

  const handleClick = (index) => {
    state.activeIndex = index;
  };

  const navItems = [
    { label: "Posts", icon: <HomeOutlined /> },
    { label: "Skill Plans", icon: <BookOutlined /> },
    { label: "Friends", icon: <TeamOutlined /> },
    { label: "Notifications", icon: <BellOutlined /> },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "#FFFFFF",
        height: "70px",
        color: "#333",
        borderBottom: "1px solid #E0E0E0",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
      }}
    >
      <div style={{ 
        fontSize: "24px", 
        fontWeight: "bold",
        color: "#2E7D32",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        ":hover": {
          transform: "scale(1.05)",
        }
      }}>
        <span style={{ color: "#2E7D32" }}>AcademiX</span>
      </div>
      
      <div style={{ 
        display: "flex",
        alignItems: "center",
        gap: "24px"
      }}>
        <ul style={{ 
          listStyle: "none", 
          padding: 0, 
          margin: 0,
          display: "flex",
          gap: "24px",
          height: "100%",
          alignItems: "center"
        }}>
          {navItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleClick(index + 1)}
              style={{
                padding: "12px 20px",
                background: snap.activeIndex === index + 1 ? "#E8F5E9" : "transparent",
                color: snap.activeIndex === index + 1 ? "#2E7D32" : "#555",
                cursor: "pointer",
                transition: "all 0.3s ease",
                borderRadius: "8px",
                fontWeight: snap.activeIndex === index + 1 ? "600" : "normal",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "16px",
                border: snap.activeIndex === index + 1 ? "1px solid #2E7D32" : "1px solid transparent",
                boxShadow: snap.activeIndex === index + 1 ? "0 2px 8px rgba(46, 125, 50, 0.2)" : "none",
                ":hover": {
                  background: snap.activeIndex === index + 1 ? "#E8F5E9" : "#F5F5F5",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.15)",
                  border: "1px solid #2E7D32",
                  color: "#2E7D32",
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = snap.activeIndex === index + 1 ? "#E8F5E9" : "#F5F5F5";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(46, 125, 50, 0.15)";
                e.currentTarget.style.border = "1px solid #2E7D32";
                e.currentTarget.style.color = "#2E7D32";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = snap.activeIndex === index + 1 ? "#E8F5E9" : "transparent";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = snap.activeIndex === index + 1 ? "0 2px 8px rgba(46, 125, 50, 0.2)" : "none";
                e.currentTarget.style.border = snap.activeIndex === index + 1 ? "1px solid #2E7D32" : "1px solid transparent";
                e.currentTarget.style.color = snap.activeIndex === index + 1 ? "#2E7D32" : "#555";
              }}
            >
              {item.icon}
              {item.label}
            </li>
          ))}
        </ul>

        <div
          onClick={() => {
            state.profileModalOpend = true;
          }}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#E8F5E9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: "2px solid #2E7D32",
            color: "#2E7D32",
            fontSize: "20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(46, 125, 50, 0.1)",
            ":hover": {
              transform: "scale(1.1)",
              boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
              borderColor: "#1B5E20"
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(46, 125, 50, 0.2)";
            e.currentTarget.style.borderColor = "#1B5E20";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(46, 125, 50, 0.1)";
            e.currentTarget.style.borderColor = "#2E7D32";
          }}
        >
          {snap.currentUser?.image ? (
            <img 
              src={snap.currentUser.image} 
              alt="Profile" 
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
                transition: "all 0.3s ease"
              }}
              onError={(e) => {
                e.target.src = null;
                e.target.parentElement.style.background = "#E8F5E9";
              }}
            />
          ) : (
            <UserOutlined style={{ fontSize: "20px" }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav; 