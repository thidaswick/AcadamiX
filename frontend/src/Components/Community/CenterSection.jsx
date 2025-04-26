import React, { useEffect, useState } from "react";
import { Avatar, Empty, Spin, message } from "antd";
import TobBox from "./TobBox";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import SkillPlanService from "../../Services/SkillPlanService";
import StateDebugger from "./StateDebugger";

// Components
import MyPost from "./MyPost";
import FriendsPost from "./FriendsPost";
import CreateSkillPlanBox from "./CreateSkillPlanBox";
import SkillPlanCard from "./SkillPlanCard";
import FriendsSection from "./FriendsSection";
import Notifications from "./Notifications";

const CenterSection = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);

  // Load posts for the feed
  useEffect(() => {
    PostService.getPosts()
      .then((result) => {
        // Create a map of post IDs to avoid duplicates
        const uniquePosts = [];
        const seenIds = new Set();
        
        result.forEach(post => {
          if (!seenIds.has(post.id)) {
            seenIds.add(post.id);
            uniquePosts.push(post);
          }
        });
        
        state.posts = uniquePosts;
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
      });
  }, []);

  // Load user-specific skill plans when the skill plans tab is active or user changes
  useEffect(() => {
    const loadUserSkillPlans = async () => {
      // Only load skill plans if the skill plans tab is selected
      if (snap.activeIndex !== 2 || !snap.currentUser?.uid) {
        return;
      }

      try {
        setLoading(true);
        // Use our updated method for user-specific skill plans
        const userSkillPlans = await SkillPlanService.getUserSkillPlans(snap.currentUser.uid);
        state.skillPlans = userSkillPlans;
      } catch (err) {
        console.error("Failed to fetch skill plans:", err);
        message.error("Failed to load your skill plans");
      } finally {
        setLoading(false);
      }
    };

    loadUserSkillPlans();
  }, [snap.activeIndex, snap.currentUser?.uid]);

  return (
    <div className="center skillplan-main-container">
      <TobBox />
      <div className="content-container skillplan-content">
        {snap.activeIndex === 1 && (
          <div className="">
            <div className="my_post">
              <MyPost />
            </div>
            <div className="posts-list">
              {snap.posts.map((post, index) => (
                <div className="friends_post" key={post.id || index}>
                  <FriendsPost post={post} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {snap.activeIndex === 2 && (
          <div className="skill-container">
            <div className="skillplan-section-header">
              <h2 className="skillplan-title-main">{snap.currentUser?.username}, This is your learning plans</h2>
              <div className="skillplan-subtitle">Track, manage, and celebrate your learning journey.</div>
              <div className="skillplan-divider"></div>
            </div>
            <StateDebugger />
            <CreateSkillPlanBox />
            
            {loading ? (
              <div className="loading-container">
                <Spin size="large" />
              </div>
            ) : snap.skillPlans?.length > 0 ? (
              <div className="plans-grid skillplan-grid">
                {snap.skillPlans.map((plan) => (
                  <SkillPlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <Empty 
                description="You haven't created any skill plans yet" 
                className="no-plans-message"
              />
            )}
          </div>
        )}
        
        {snap.activeIndex === 3 && (
          <div className="friends-container">
            <FriendsSection />
          </div>
        )}
        
        {snap.activeIndex === 4 && (
          <div className="notifications-container">
            <Notifications />
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterSection;