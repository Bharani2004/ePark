import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/UpdateProfile.css'; // Import the CSS file

const UpdateProfile = () => {
  const [profileData, setProfileData] = useState({ name: '', email: '', mobile: '', address: '' });
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/api/v1/profile/${username}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9090/api/v1/profile/${username}`, profileData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="update-profile-container">
      <h1>Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            readOnly
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={profileData.mobile}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={profileData.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update</button>
        <button type="button" onClick={handleBack}>Back to Dashboard</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
