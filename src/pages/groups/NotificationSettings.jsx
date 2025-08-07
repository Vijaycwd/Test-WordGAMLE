import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const NOTIFICATION_FIELDS = {
  new_group_chat_message: "New Group Chat Message",
  group_invitation: "Group Invitation",
  scoring_method_change: "Scoring Method change",
  group_member_game_preference_change: "Group Member game preference change",
  member_played_notification: "Notification when each Group Member plays",
  winner_announcement: "WINNER WINNER message",
  one_hour_warning: "One hour warning for each game period end",
  new_game_period: "New game period",
};

function NotificationSettings({ userId }) {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const [settings, setSettings] = useState({});

    //Fetch current user settings from backend (if you want to load on mount)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${baseURL}/user/get_user_notification_settings.php`, {
                    params: { user_id: userId }
                });

                if (res.data.status == "success") {
                    setSettings(res.data.settings); // Default to empty string
                } else {
                    toast.error("Settings Failed.");
                }
            } catch (err) {
                toast.error("Failed to load group info.");
            }
        };

        if (userId) {  
            fetchSettings();
        }
    }, [userId]); 

    // Toggle handler
    const handleToggle = (field) => {
        setSettings((prev) => ({
        ...prev,
        [field]: !prev[field],
        }));
    };

    // Save to backend
    const saveSettings = async () => {
        try {
        const response = await axios.post(`${baseURL}/user/add_user_notification_settings.php`, {
            user_id: userId,
            settings: Object.fromEntries(
            Object.entries(settings).map(([k, v]) => [k, v ? 1 : 0])
            ),
        });

        if (response.data.status == "success") {
            toast.success(response.data.message);
            // alert('Settings saved!');
        } else {
            toast.error("Failed to save settings");
            // alert('Failed to save settings');
        }
        } catch (error) {
        console.error('Error saving notification settings:', error);
        
        }
    };

    return (
        <div className="mt-4">
        <h4 className="mb-3">Notification Settings</h4>
        <ul className="list-group">
            {Object.entries(NOTIFICATION_FIELDS).map(([field, label]) => (
            <li key={field} className="list-group-item d-flex justify-content-between align-items-center">
                {label}
                <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={!!settings[field]}
                    onChange={() => handleToggle(field)}
                />
                </div>
            </li>
            ))}
        </ul>
        <button className="btn btn-primary mt-3" onClick={saveSettings}>
            Save Settings
        </button>
        </div>
    );
}

export default NotificationSettings;
