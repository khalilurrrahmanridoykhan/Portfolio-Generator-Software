import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Collapse } from 'react-collapse';

const AddUserInfo = () => {
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [codeforces, setCodeforces] = useState('');
  const [website, setWebsite] = useState('');
  const [education, setEducation] = useState({
    type: '',
    instruct: '',
    result: '',
    cgpa: false,
    startAt: '',
    endAt: ''
  });
  const [intodec, setIntodec] = useState({
    description: ''
  });
  const [project, setProject] = useState({
    title: '',
    description: '',
    doneAt: '',
    link: ''
  });
  const [skills, setSkills] = useState({
    title: '',
    allskills: []
  });
  const [workExperience, setWorkExperience] = useState({
    companyName: '',
    jobDuration: '',
    jobResponsibilities: [],
    description: '',
    startAt: '',
    endAt: ''
  });
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isIntodecOpen, setIsIntodecOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isWorkExperienceOpen, setIsWorkExperienceOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinkData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/user/links', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { github, linkedin, codeforces, website } = response.data;
        setGithub(github || '');
        setLinkedin(linkedin || '');
        setCodeforces(codeforces || '');
        setWebsite(website || '');
      } catch (error) {
        console.error('Error fetching link data:', error);
      }
    };

    const fetchEducationData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/user/education', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const educationData = response.data;
        if (educationData) {
          setEducation(educationData);
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };

    const fetchIntodecData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/user/intodec', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const intodecData = response.data;
        if (intodecData) {
          setIntodec(intodecData);
        }
      } catch (error) {
        console.error('Error fetching intodec data:', error);
      }
    };

    const fetchProjectData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/user/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const projectData = response.data;
        if (projectData) {
          setProject(projectData);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    const fetchSkillsData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/user/skills', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const skillsData = response.data;
        if (skillsData) {
          setSkills(skillsData);
        }
      } catch (error) {
        console.error('Error fetching skills data:', error);
      }
    };

    const fetchWorkExperienceData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/user/work-experience', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const workExperienceData = response.data;
        if (workExperienceData) {
          setWorkExperience(workExperienceData);
        }
      } catch (error) {
        console.error('Error fetching work experience data:', error);
      }
    };

    fetchLinkData();
    fetchEducationData();
    fetchIntodecData();
    fetchProjectData();
    fetchSkillsData();
    fetchWorkExperienceData();
  }, [navigate]);

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const method = github || linkedin || codeforces || website ? 'put' : 'post';
      const response = await axios({
        method,
        url: 'http://localhost:5001/api/user/links',
        data: { github, linkedin, codeforces, website },
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Links added/updated successfully:', response.data);
      navigate('/dashboard'); // Redirect to dashboard after successful submission
    } catch (error) {
      console.error('Error adding/updating links:', error);
    }
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/user/education', education, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Education added/updated successfully:', response.data);
      navigate('/dashboard'); // Redirect to dashboard after successful submission
    } catch (error) {
      console.error('Error adding/updating education:', error);
    }
  };

  const handleIntodecSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/user/intodec', intodec, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Intodec added/updated successfully:', response.data);
      navigate('/dashboard'); // Redirect to dashboard after successful submission
    } catch (error) {
      console.error('Error adding/updating intodec:', error);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/user/projects', project, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Project added/updated successfully:', response.data);
      navigate('/dashboard'); // Redirect to dashboard after successful submission
    } catch (error) {
      console.error('Error adding/updating project:', error);
    }
  };

  const handleSkillsSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/user/skills', skills, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Skills added/updated successfully:', response.data);
      navigate('/dashboard'); // Redirect to dashboard after successful submission
    } catch (error) {
      console.error('Error adding/updating skills:', error);
    }
  };

  const handleWorkExperienceSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/user/work-experience', workExperience, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Work experience added/updated successfully:', response.data);
      navigate('/dashboard'); // Redirect to dashboard after successful submission
    } catch (error) {
      console.error('Error adding/updating work experience:', error);
    }
  };

  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEducation((prevEducation) => ({
      ...prevEducation,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIntodecChange = (e) => {
    const { name, value } = e.target;
    setIntodec((prevIntodec) => ({
      ...prevIntodec,
      [name]: value
    }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const { name, value } = e.target;
    setSkills((prevSkills) => ({
      ...prevSkills,
      [name]: value
    }));
  };

  const handleWorkExperienceChange = (e) => {
    const { name, value } = e.target;
    setWorkExperience((prevWorkExperience) => ({
      ...prevWorkExperience,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>Add/Update User Info</h2>
      <button onClick={() => setIsUserInfoOpen(!isUserInfoOpen)}>
        {isUserInfoOpen ? 'Hide' : 'Show'} User Info Form
      </button>
      <Collapse isOpened={isUserInfoOpen}>
        <form onSubmit={handleUserInfoSubmit}>
          <div>
            <label>GitHub:</label>
            <input type="text" value={github} onChange={(e) => setGithub(e.target.value)} required />
          </div>
          <div>
            <label>LinkedIn:</label>
            <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} required />
          </div>
          <div>
            <label>Codeforces:</label>
            <input type="text" value={codeforces} onChange={(e) => setCodeforces(e.target.value)} required />
          </div>
          <div>
            <label>Website:</label>
            <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} required />
          </div>
          <button type="submit">Add/Update Info</button>
        </form>
      </Collapse>

      <h2>Add/Update User Education</h2>
      <button onClick={() => setIsEducationOpen(!isEducationOpen)}>
        {isEducationOpen ? 'Hide' : 'Show'} Education Form
      </button>
      <Collapse isOpened={isEducationOpen}>
        <form onSubmit={handleEducationSubmit}>
          <div>
            <label>Type:</label>
            <input type="text" name="type" value={education.type} onChange={handleEducationChange} required />
          </div>
          <div>
            <label>Instructor:</label>
            <input type="text" name="instruct" value={education.instruct} onChange={handleEducationChange} required />
          </div>
          <div>
            <label>Result:</label>
            <input type="text" name="result" value={education.result} onChange={handleEducationChange} required />
          </div>
          <div>
            <label>CGPA:</label>
            <input type="checkbox" name="cgpa" checked={education.cgpa} onChange={handleEducationChange} />
          </div>
          <div>
            <label>Start Date:</label>
            <input type="text" name="startAt" value={education.startAt} onChange={handleEducationChange} required />
          </div>
          <div>
            <label>End Date:</label>
            <input type="text" name="endAt" value={education.endAt} onChange={handleEducationChange} required />
          </div>
          <button type="submit">Add/Update Education</button>
        </form>
      </Collapse>

      <h2>Add/Update Intodec</h2>
      <button onClick={() => setIsIntodecOpen(!isIntodecOpen)}>
        {isIntodecOpen ? 'Hide' : 'Show'} Intodec Form
      </button>
      <Collapse isOpened={isIntodecOpen}>
        <form onSubmit={handleIntodecSubmit}>
          <div>
            <label>Description:</label>
            <input type="text" name="description" value={intodec.description} onChange={handleIntodecChange} required />
          </div>
          <button type="submit">Add/Update Intodec</button>
        </form>
      </Collapse>

      <h2>Add/Update Project</h2>
      <button onClick={() => setIsProjectOpen(!isProjectOpen)}>
        {isProjectOpen ? 'Hide' : 'Show'} Project Form
      </button>
      <Collapse isOpened={isProjectOpen}>
        <form onSubmit={handleProjectSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={project.title} onChange={handleProjectChange} required />
          </div>
          <div>
            <label>Description:</label>
            <input type="text" name="description" value={project.description} onChange={handleProjectChange} required />
          </div>
          <div>
            <label>Done At:</label>
            <input type="text" name="doneAt" value={project.doneAt} onChange={handleProjectChange} required />
          </div>
          <div>
            <label>Link:</label>
            <input type="text" name="link" value={project.link} onChange={handleProjectChange} required />
          </div>
          <button type="submit">Add/Update Project</button>
        </form>
      </Collapse>

      <h2>Add/Update Skills</h2>
      <button onClick={() => setIsSkillsOpen(!isSkillsOpen)}>
        {isSkillsOpen ? 'Hide' : 'Show'} Skills Form
      </button>
      <Collapse isOpened={isSkillsOpen}>
        <form onSubmit={handleSkillsSubmit}>
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={skills.title} onChange={handleSkillsChange} required />
          </div>
          <div>
            <label>All Skills:</label>
            <input type="text" name="allskills" value={skills.allskills.join(', ')} onChange={(e) => handleSkillsChange({ target: { name: 'allskills', value: e.target.value.split(', ') } })} required />
          </div>
          <button type="submit">Add/Update Skills</button>
        </form>
      </Collapse>

      <h2>Add/Update Work Experience</h2>
      <button onClick={() => setIsWorkExperienceOpen(!isWorkExperienceOpen)}>
        {isWorkExperienceOpen ? 'Hide' : 'Show'} Work Experience Form
      </button>
      <Collapse isOpened={isWorkExperienceOpen}>
        <form onSubmit={handleWorkExperienceSubmit}>
          <div>
            <label>Company Name:</label>
            <input type="text" name="companyName" value={workExperience.companyName} onChange={handleWorkExperienceChange} required />
          </div>
          <div>
            <label>Job Duration:</label>
            <input type="text" name="jobDuration" value={workExperience.jobDuration} onChange={handleWorkExperienceChange} required />
          </div>
          <div>
            <label>Job Responsibilities:</label>
            <input type="text" name="jobResponsibilities" value={workExperience.jobResponsibilities.join(', ')} onChange={(e) => handleWorkExperienceChange({ target: { name: 'jobResponsibilities', value: e.target.value.split(', ') } })} required />
          </div>
          <div>
            <label>Description:</label>
            <input type="text" name="description" value={workExperience.description} onChange={handleWorkExperienceChange} required />
          </div>
          <div>
            <label>Start Date:</label>
            <input type="text" name="startAt" value={workExperience.startAt} onChange={handleWorkExperienceChange} required />
          </div>
          <div>
            <label>End Date:</label>
            <input type="text" name="endAt" value={workExperience.endAt} onChange={handleWorkExperienceChange} required />
          </div>
          <button type="submit">Add/Update Work Experience</button>
        </form>
      </Collapse>
    </div>
  );
};

export default AddUserInfo;