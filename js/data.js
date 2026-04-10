// Sample tutor data used across the frontend.
const tutorsData = [
  {
    id: "tutor-1",
    name: "Aman Srivastava",
    subject: ["Math", "Physics"],
    classes: "Class 9-12",
    location: "Lucknow",
    area: "Gomti Nagar",
    budget: 900,
    experience: 6,
    rating: 4.8,
    bio: "Focused on conceptual clarity for CBSE and ICSE students, with extra support for board exam preparation.",
    education: "B.Tech in Mechanical Engineering",
    availability: "Evening and weekend batches",
    languages: "Hindi, English",
    whatsapp: "919999999901"
  },
  {
    id: "tutor-2",
    name: "Shreya Mishra",
    subject: ["English", "Social Science"],
    classes: "Class 6-10",
    location: "Lucknow",
    area: "Aliganj",
    budget: 700,
    experience: 5,
    rating: 4.7,
    bio: "Helps students improve writing, grammar, reading comprehension, and school homework confidence.",
    education: "M.A. in English",
    availability: "Morning and evening slots",
    languages: "Hindi, English",
    whatsapp: "919999999902"
  },
  {
    id: "tutor-3",
    name: "Ritika Verma",
    subject: ["Biology", "Chemistry"],
    classes: "Class 9-12",
    location: "Lucknow",
    area: "Indira Nagar",
    budget: 1000,
    experience: 7,
    rating: 4.9,
    bio: "Specialized in Science stream coaching with a calm teaching approach for board exams and NEET foundation.",
    education: "M.Sc. in Biotechnology",
    availability: "Evening slots",
    languages: "Hindi, English",
    whatsapp: "919999999903"
  },
  {
    id: "tutor-4",
    name: "Nitin Gupta",
    subject: ["Commerce", "Math"],
    classes: "Class 11-12",
    location: "Ayodhya",
    area: "Civil Lines",
    budget: 850,
    experience: 4,
    rating: 4.6,
    bio: "Covers Accountancy, Business Studies, and core Math with step-by-step explanations.",
    education: "M.Com",
    availability: "Afternoon and weekend",
    languages: "Hindi, English",
    whatsapp: "919999999904"
  },
  {
    id: "tutor-5",
    name: "Saba Khan",
    subject: ["Science", "Math"],
    classes: "Class 5-8",
    location: "Basti",
    area: "Gandhi Nagar",
    budget: 650,
    experience: 3,
    rating: 4.5,
    bio: "Builds strong basics for middle school students through worksheets and regular revision.",
    education: "B.Sc. and B.Ed.",
    availability: "Flexible evening timing",
    languages: "Hindi, English",
    whatsapp: "919999999905"
  },
  {
    id: "tutor-6",
    name: "Aditya Tiwari",
    subject: ["Physics", "Chemistry"],
    classes: "Class 10-12",
    location: "Lucknow",
    area: "Aliganj",
    budget: 1100,
    experience: 8,
    rating: 4.8,
    bio: "Supports board exam strategy, numerical practice, and chapter-wise revision for senior students.",
    education: "M.Tech",
    availability: "Evening only",
    languages: "Hindi, English",
    whatsapp: "919999999906"
  },
  {
    id: "tutor-7",
    name: "Pooja Singh",
    subject: ["English", "Biology"],
    classes: "Class 8-12",
    location: "Ayodhya",
    area: "Faizabad Road",
    budget: 780,
    experience: 5,
    rating: 4.7,
    bio: "Known for patient teaching and personalized handwritten notes for school students.",
    education: "B.Ed. and M.A.",
    availability: "Morning slots available",
    languages: "Hindi, English",
    whatsapp: "919999999907"
  },
  {
    id: "tutor-8",
    name: "Rahul Dwivedi",
    subject: ["Math", "Science", "English"],
    classes: "Class 4-7",
    location: "Lucknow",
    area: "Gomti Nagar",
    budget: 600,
    experience: 4,
    rating: 4.6,
    bio: "Works well with younger learners and focuses on discipline, basics, and homework support.",
    education: "B.Sc.",
    availability: "After school timing",
    languages: "Hindi, English",
    whatsapp: "919999999908"
  }
];

// Mock data used by the admin dashboard demo.
const adminData = {
  tutorRequests: [
    {
      id: "req-101",
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      classLevel: "Class 10",
      subject: "Math",
      area: "Gomti Nagar, Lucknow",
      budget: "₹900/month",
      timing: "Evening",
      status: "new"
    },
    {
      id: "req-102",
      name: "Arjun Yadav",
      phone: "+91 99887 76655",
      classLevel: "Class 12",
      subject: "Physics",
      area: "Aliganj, Lucknow",
      budget: "₹1,200/month",
      timing: "Morning",
      status: "review"
    },
    {
      id: "req-103",
      name: "Farah Siddiqui",
      phone: "+91 97654 23189",
      classLevel: "Class 8",
      subject: "Science",
      area: "Basti",
      budget: "₹700/month",
      timing: "Weekend",
      status: "pending"
    }
  ],
  tutorRegistrations: [
    {
      id: "reg-201",
      name: "Deepak Singh",
      phone: "+91 98712 30123",
      subjects: "Math, Physics",
      classes: "Class 9-12",
      location: "Indira Nagar, Lucknow",
      experience: "5 years",
      fees: "₹1,000/month",
      status: "review"
    },
    {
      id: "reg-202",
      name: "Meenal Gupta",
      phone: "+91 98990 44556",
      subjects: "English, Commerce",
      classes: "Class 8-12",
      location: "Ayodhya",
      experience: "6 years",
      fees: "₹900/month",
      status: "new"
    },
    {
      id: "reg-203",
      name: "Sahil Verma",
      phone: "+91 98221 11223",
      subjects: "Science, Biology",
      classes: "Class 6-10",
      location: "Gomti Nagar, Lucknow",
      experience: "3 years",
      fees: "₹750/month",
      status: "pending"
    }
  ]
};
