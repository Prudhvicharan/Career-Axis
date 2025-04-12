// This is a test implementation that returns mock data based on your emails
export const fetchEmails = async (accessToken) => {
  console.log("Using test implementation with mock data");

  // Mock data based on the emails shown in your screenshot
  const mockEmails = [
    {
      id: "email1",
      threadId: "thread1",
      subject: "Assoc Engineer, Software at T-Mobile and 9 more",
      from: "Glassdoor Jobs <noreply@glassdoor.com>",
      date: new Date().toISOString(), // Today's date
      body: "We found a job listing for Assoc Engineer, Software at T-Mobile that you might be interested in.",
      snippet:
        "We found a job listing for Assoc Engineer, Software at T-Mobile that you might be interested in.",
      url: "https://mail.google.com/mail/u/0/#inbox/email1",
    },
    {
      id: "email2",
      threadId: "thread2",
      subject: "You can now message your 2 new connections",
      from: "LinkedIn <messages-noreply@linkedin.com>",
      date: new Date().toISOString(), // Today's date
      body: "You can now message your 2 new connections on LinkedIn.",
      snippet: "You can now message your 2 new connections on LinkedIn.",
      url: "https://mail.google.com/mail/u/0/#inbox/email2",
    },
    {
      id: "email3",
      threadId: "thread3",
      subject: "Thank you for your interest in West Monroe",
      from: "West Monroe Recruit <recruit@westmonroe.com>",
      date: new Date().toISOString(), // Today's date
      body: "Thank you for your interest in West Monroe. We have received your application and will review it shortly.",
      snippet:
        "Thank you for your interest in West Monroe. We have received your application.",
      url: "https://mail.google.com/mail/u/0/#inbox/email3",
    },
    {
      id: "email4",
      threadId: "thread4",
      subject: "Software Development Manager role at Tria Health",
      from: "Glassdoor Jobs <noreply@glassdoor.com>",
      date: new Date().toISOString(), // Today's date
      body: "We found a job listing for Software Development Manager at Tria Health that matches your profile.",
      snippet:
        "We found a job listing for Software Development Manager at Tria Health.",
      url: "https://mail.google.com/mail/u/0/#inbox/email4",
    },
    {
      id: "email5",
      threadId: "thread5",
      subject: "Dematic - Your Application for Software Quality Engineer",
      from: "KION Group Workday <notifications@workday.com>",
      date: new Date().toISOString(), // Today's date
      body: "Thank you for submitting your application for the Software Quality Engineer position at Dematic.",
      snippet:
        "Thank you for submitting your application for the Software Quality Engineer position.",
      url: "https://mail.google.com/mail/u/0/#inbox/email5",
    },
    {
      id: "email6",
      threadId: "thread6",
      subject:
        "Prudhvi Charan, we've found new positions that match your profile",
      from: "ZipRecruiter <jobs@ziprecruiter.com>",
      date: new Date().toISOString(), // Today's date
      body: "We've found new positions that match your profile. Check out these job opportunities.",
      snippet: "We've found new positions that match your profile.",
      url: "https://mail.google.com/mail/u/0/#inbox/email6",
    },
    {
      id: "email7",
      threadId: "thread7",
      subject: "E-Commerce IT Developer @ DGS Retail - $95,000/year",
      from: "Indeed <alert@indeed.com>",
      date: new Date().toISOString(), // Today's date
      body: "New job: E-Commerce IT Developer at DGS Retail. Salary: $95,000/year",
      snippet:
        "New job: E-Commerce IT Developer at DGS Retail. Salary: $95,000/year",
      url: "https://mail.google.com/mail/u/0/#inbox/email7",
    },
    {
      id: "email8",
      threadId: "thread8",
      subject: "Thanks for your interest in SquareTrade",
      from: "SquareTrade Hiring <hiring@squaretrade.com>",
      date: new Date().toISOString(), // Today's date
      body: "Hi Prudhvi, Thank you for your interest in SquareTrade. We have received your application.",
      snippet: "Hi Prudhvi, Thank you for your interest in SquareTrade.",
      url: "https://mail.google.com/mail/u/0/#inbox/email8",
    },
    {
      id: "email9",
      threadId: "thread9",
      subject: "Application Follow Up: R1591608 Software Engineer",
      from: "Workday Concentrix <notifications@workday.com>",
      date: new Date().toISOString(), // Today's date
      body: "This is a follow-up regarding your application for the Software Engineer position (R1591608).",
      snippet:
        "This is a follow-up regarding your application for the Software Engineer position.",
      url: "https://mail.google.com/mail/u/0/#inbox/email9",
    },
    {
      id: "email10",
      threadId: "thread10",
      subject: "Your application to Software Engineer at Cortwo",
      from: "LinkedIn <jobs-noreply@linkedin.com>",
      date: new Date().toISOString(), // Today's date
      body: "Your application to Software Engineer at Cortwo has been submitted successfully.",
      snippet:
        "Your application to Software Engineer at Cortwo has been submitted.",
      url: "https://mail.google.com/mail/u/0/#inbox/email10",
    },
  ];

  return mockEmails;
};
