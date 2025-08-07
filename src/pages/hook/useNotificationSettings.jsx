import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const useNotificationSettings = (userId) => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${baseURL}/user/get_user_notification_settings.php`, {
                    params: { user_id: userId }
                });

                if (res.data.status === 'success') {
                    setSettings(res.data.settings);
                } else {
                    toast.error("Settings Failed.");
                }
            } catch (err) {
                toast.error("Failed to load group info.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchSettings();
        }
    }, [userId]);

    return { settings, loading };
};

export default useNotificationSettings;
