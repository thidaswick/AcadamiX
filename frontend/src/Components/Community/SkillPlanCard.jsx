import React, { useState, useEffect } from "react";
import { Card, Button, Checkbox, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import SkillPlanService from "../../Services/SkillPlanService";
import dayjs from 'dayjs';

const SkillPlanCard = ({ plan }) => {
  const snap = useSnapshot(state);
  const [deleteLoading, setIsDeleteLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(Boolean(plan.isFinished));
  const [updateLoading, setUpdateLoading] = useState(false);

  // Update local state when plan prop changes
  useEffect(() => {
    setIsFinished(Boolean(plan.isFinished));
  }, [plan.isFinished]);

  const deletePlan = async () => {
    try {
      setIsDeleteLoading(true);
      
      // Ensure user ID is passed for ownership verification
      await SkillPlanService.deleteSkillPlan(plan.id, snap.currentUser.uid);
      
      // Refresh the skill plans list specifically for the current user
      state.skillPlans = await SkillPlanService.getUserSkillPlans(snap.currentUser.uid);
    } catch (error) {
      console.error("Error deleting plan:", error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleCheckboxChange = async (e) => {
    try {
      setUpdateLoading(true);
      const newStatus = e.target.checked;
      
      // Update local state immediately for better UX
      setIsFinished(newStatus);

      // Make a copy of the plan to avoid direct mutation
      const updatedPlan = {
        ...plan,
        isFinished: newStatus,
        finished: newStatus, // Include both fields for consistency
        userId: snap.currentUser.uid // Include user ID for ownership verification
      };

      // Update the plan in the backend
      await SkillPlanService.updateSkillPlan(plan.id, updatedPlan);

      // Update the plan in global state
      const updatedPlans = snap.skillPlans.map(p => 
        p.id === plan.id ? { ...p, isFinished: newStatus, finished: newStatus } : p
      );
      state.skillPlans = updatedPlans;
      
      // Optional: Refresh from server to ensure consistency
      state.skillPlans = await SkillPlanService.getUserSkillPlans(snap.currentUser.uid);
    } catch (error) {
      console.error("Error updating plan status:", error);
      // Revert local state on error
      setIsFinished(!e.target.checked);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Card
      className={`skill-plan-card modern-skillplan-card ${isFinished ? 'skill-plan-completed' : 'skill-plan-active'}`}
      bordered={false}
      style={{
        borderRadius: 20,
        boxShadow: '0 4px 24px rgba(46, 125, 50, 0.08)',
        padding: 0,
        background: '#fff',
        margin: '0 auto',
        maxWidth: 420,
        minHeight: 220,
        transition: 'box-shadow 0.2s',
        marginBottom: 32,
        border: 'none',
        position: 'relative',
      }}
      bodyStyle={{
        padding: 0,
        borderRadius: 20,
      }}
      tabIndex={0}
      aria-label={`Skill plan: ${plan.skillDetails}`}
    >
      <div className="skill-plan-header modern-skillplan-header" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 24px 0 24px', borderTopLeftRadius: 20, borderTopRightRadius: 20
      }}>
        <Checkbox
          checked={isFinished}
          onChange={handleCheckboxChange}
          disabled={updateLoading}
          className="skill-plan-checkbox modern-skillplan-checkbox"
          style={{
            accentColor: isFinished ? '#2E7D32' : '#BDBDBD',
            width: 22, height: 22, marginRight: 16
          }}
          aria-label={isFinished ? 'Mark as incomplete' : 'Mark as complete'}
        />
        <h3 className="skill-plan-title modern-skillplan-title" style={{
          fontSize: 20, fontWeight: 700, color: '#222', margin: 0, flex: 1, textAlign: 'left', letterSpacing: 0.2
        }}>{plan.skillDetails}</h3>
        <div className="skill-plan-action-buttons modern-skillplan-actions" style={{ display: 'flex', gap: 8 }}>
          <Tooltip title="Edit task">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                state.selectedSkillPlanToUpdate = plan;
                state.updateSkillPlanOpened = true;
              }}
              className="skill-plan-edit-btn modern-skillplan-btn"
              type="text"
              style={{
                color: '#43A047', borderRadius: 8, fontWeight: 600, fontSize: 16, padding: 0, minWidth: 36, height: 36,
                transition: 'background 0.2s, color 0.2s',
              }}
              aria-label="Edit skill plan"
            />
          </Tooltip>
          <Tooltip title="Delete task">
            <Button
              icon={<DeleteOutlined />}
              onClick={deletePlan}
              loading={deleteLoading}
              className="skill-plan-delete-btn modern-skillplan-btn"
              type="text"
              danger
              style={{
                color: '#E53935', borderRadius: 8, fontWeight: 600, fontSize: 16, padding: 0, minWidth: 36, height: 36,
                transition: 'background 0.2s, color 0.2s',
              }}
              aria-label="Delete skill plan"
            />
          </Tooltip>
        </div>
      </div>
      <div className="skill-plan-body modern-skillplan-body" style={{ padding: '16px 24px 0 24px' }}>
        <div className="skill-plan-metadata modern-skillplan-meta" style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
          <div className="skill-plan-tag modern-skillplan-tag" style={{ background: '#E8F5E9', color: '#2E7D32', borderRadius: 8, padding: '2px 12px', fontWeight: 600, fontSize: 14 }}>Level: {plan.skillLevel}</div>
          <div className="skill-plan-date modern-skillplan-date" style={{ color: '#888', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockCircleOutlined /> {dayjs(plan.date).format('MMM D, YYYY')}
          </div>
        </div>
        {plan.resources && (
          <div className="skill-plan-resources modern-skillplan-resources" style={{ marginTop: 8, fontSize: 15, color: '#444' }}>
            <div className="skill-plan-resources-label" style={{ fontWeight: 600, marginBottom: 2 }}>Resources:</div>
            <div className="skill-plan-resources-value" style={{ color: '#333', fontWeight: 400 }}>{plan.resources}</div>
          </div>
        )}
      </div>
      <div className="skill-plan-status modern-skillplan-status" style={{
        padding: '18px 24px 20px 24px', display: 'flex', alignItems: 'center', gap: 10, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginTop: 18
      }}>
        {isFinished ? (
          <div className="skill-plan-completed-tag modern-skillplan-completed" style={{ color: '#2E7D32', background: '#E8F5E9', borderRadius: 8, padding: '4px 14px', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircleOutlined /> Completed
          </div>
        ) : (
          <div className="skill-plan-pending-tag modern-skillplan-pending" style={{ color: '#888', background: '#F1F3F4', borderRadius: 8, padding: '4px 14px', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ClockCircleOutlined /> In Progress
          </div>
        )}
      </div>
    </Card>
  );
};

export default SkillPlanCard;