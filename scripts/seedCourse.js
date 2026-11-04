
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Course from "../models/Course.js";
import Assignment from "../models/Assignment.js";

dotenv.config();


const weeks = [
  {
    weekNumber: 1,
    subject: "HTML",
    title: "Introduction to HTML",
    description:
      "Understand how websites work and learn how to create your first HTML document.",
       isLocked: false,
    topics: [
      "How the internet and websites work",
      "Introduction to HTML",
      "HTML document structure",
      "Headings and paragraphs",
      "HTML elements and attributes",
    ],
    material:
      "Learn the basic structure of HTML documents and how to create meaningful webpage content.",
    resources: [
      { title: "HTML Introduction", provider: "W3Schools", url: "https://www.w3schools.com/html/html_intro.asp" },
      { title: "HTML Editors", provider: "W3Schools", url: "https://www.w3schools.com/html/html_editors.asp" },
      { title: "HTML Basic Examples", provider: "W3Schools", url: "https://www.w3schools.com/html/html_basic.asp" },
    ],
  },
  {
    weekNumber: 2,
    subject: "HTML",
    title: "HTML Elements and Forms",
    description:
      "Learn how to add different types of content and structure interactive forms.",
       isLocked: true,
    topics: [
      "Links and navigation",
      "Images and multimedia",
      "Ordered and unordered lists",
      "HTML tables",
      "Forms and input elements",
      "Semantic HTML",
    ],
    material:
      "Explore HTML elements used to structure content, navigate between pages and collect information.",
    resources: [
      { title: "HTML Links", provider: "W3Schools", url: "https://www.w3schools.com/html/html_links.asp" },
      { title: "HTML Images", provider: "W3Schools", url: "https://www.w3schools.com/html/html_images.asp" },
      { title: "HTML Tables", provider: "W3Schools", url: "https://www.w3schools.com/html/html_tables.asp" },
      { title: "HTML Forms", provider: "W3Schools", url: "https://www.w3schools.com/html/html_forms.asp" },
      { title: "HTML Semantic Elements", provider: "W3Schools", url: "https://www.w3schools.com/html/html5_semantic_elements.asp" },
    ],
  },
  {
    weekNumber: 3,
    subject: "CSS",
    title: "CSS Fundamentals",
    description:
      "Learn how to style HTML elements and control the appearance of a website.",
       isLocked: true,
    topics: [
      "Introduction to CSS",
      "Inline, internal and external CSS",
      "CSS selectors",
      "Colours and backgrounds",
      "Fonts and typography",
      "Margins, padding and borders",
      "CSS box model",
    ],
    material:
      "Understand how CSS works and how to apply styling to HTML elements.",
    resources: [
      { title: "CSS Introduction", provider: "W3Schools", url: "https://www.w3schools.com/css/css_intro.asp" },
      { title: "CSS Selectors", provider: "W3Schools", url: "https://www.w3schools.com/css/css_selectors.asp" },
      { title: "CSS Colors", provider: "W3Schools", url: "https://www.w3schools.com/css/css_colors.asp" },
      { title: "CSS Box Model", provider: "W3Schools", url: "https://www.w3schools.com/css/css_boxmodel.asp" },
    ],
  },
  {
    weekNumber: 4,
    subject: "CSS",
    title: "CSS Layouts",
    description:
      "Learn how to organise webpage content and create structured layouts.",
       isLocked: true,
    topics: [
      "CSS display properties",
      "CSS positioning",
      "Flexbox",
      "CSS Grid",
      "Alignment and spacing",
      "Creating navigation bars",
    ],
    material:
      "Learn how to position elements and create organised website layouts.",
    resources: [
      { title: "CSS Display", provider: "W3Schools", url: "https://www.w3schools.com/css/css_display_visibility.asp" },
      { title: "CSS Position", provider: "W3Schools", url: "https://www.w3schools.com/css/css_positioning.asp" },
      { title: "CSS Flexbox", provider: "W3Schools", url: "https://www.w3schools.com/css/css3_flexbox.asp" },
      { title: "CSS Grid", provider: "W3Schools", url: "https://www.w3schools.com/css/css_grid.asp" },
    ],
  },
  {
    weekNumber: 5,
    subject: "CSS",
    title: "Responsive Web Design",
    description:
      "Make websites look good and function properly on different screen sizes.",
       isLocked: true,
    topics: [
      "Introduction to responsive design",
      "Media queries",
      "Mobile-first design",
      "Responsive images",
      "Relative CSS units",
      "Responsive navigation",
      "CSS transitions and hover effects",
    ],
    material:
      "Understand how to adapt website layouts to mobile phones, tablets and desktop screens.",
    resources: [
      { title: "CSS Responsive", provider: "W3Schools", url: "https://www.w3schools.com/css/css_rwd_intro.asp" },
      { title: "CSS Media Queries", provider: "W3Schools", url: "https://www.w3schools.com/css/css3_mediaqueries.asp" },
      { title: "CSS RWD", provider: "W3Schools", url: "https://www.w3schools.com/css/css_rwd_mediaqueries.asp" },
      { title: "CSS Transitions", provider: "W3Schools", url: "https://www.w3schools.com/css/css3_transitions.asp" },
    ],
  },
  {
    weekNumber: 6,
    subject: "JavaScript",
    title: "JavaScript Fundamentals",
    description:
      "Understand programming concepts and learn how to introduce logic into websites.",
       isLocked: true,
    topics: [
      "Introduction to JavaScript",
      "Variables: let, const and var",
      "Data types",
      "Operators",
      "Conditional statements",
      "Functions",
      "Basic loops",
    ],
    material:
      "Learn the basic building blocks of JavaScript programming and how to write simple programs.",
    resources: [
      { title: "JavaScript Introduction", provider: "W3Schools", url: "https://www.w3schools.com/js/js_intro.asp" },
      { title: "JavaScript Variables", provider: "W3Schools", url: "https://www.w3schools.com/js/js_variables.asp" },
      { title: "JavaScript Data Types", provider: "W3Schools", url: "https://www.w3schools.com/js/js_datatypes.asp" },
      { title: "JavaScript Functions", provider: "W3Schools", url: "https://www.w3schools.com/js/js_functions.asp" },
      { title: "JavaScript Conditions", provider: "W3Schools", url: "https://www.w3schools.com/js/js_if_else.asp" },
    ],
  },
  {
    weekNumber: 7,
    subject: "JavaScript",
    title: "JavaScript Data and DOM",
    description:
      "Learn how to work with collections of information and interact with webpage elements.",
       isLocked: true,
    topics: [
      "Arrays",
      "Objects",
      "Array methods",
      "Introduction to the DOM",
      "Selecting HTML elements",
      "Changing HTML content",
      "Changing element styles",
    ],
    material:
      "Explore how JavaScript stores information and interacts with HTML elements through the DOM.",
    resources: [
      { title: "JavaScript Arrays", provider: "W3Schools", url: "https://www.w3schools.com/js/js_arrays.asp" },
      { title: "JavaScript Objects", provider: "W3Schools", url: "https://www.w3schools.com/js/js_objects.asp" },
      { title: "JavaScript Array Methods", provider: "W3Schools", url: "https://www.w3schools.com/js/js_array_methods.asp" },
      { title: "HTML DOM Introduction", provider: "W3Schools", url: "https://www.w3schools.com/js/js_htmldom.asp" },
      { title: "HTML DOM Elements", provider: "W3Schools", url: "https://www.w3schools.com/js/js_htmldom_elements.asp" },
    ],
  },
  {
    weekNumber: 8,
    subject: "JavaScript",
    title: "JavaScript Events and Final Project",
    description:
      "Bring your HTML, CSS and JavaScript knowledge together to build an interactive website.",
       isLocked: true,
    topics: [
      "Introduction to events",
      "Event listeners",
      "Click and input events",
      "Form interaction",
      "Updating webpage content dynamically",
      "Basic debugging",
      "Final project development",
    ],
    material:
      "Learn how to respond to user actions and combine everything you have learned into a working website.",
    resources: [
      { title: "JavaScript Events", provider: "W3Schools", url: "https://www.w3schools.com/js/js_events.asp" },
      { title: "JavaScript Event Listeners", provider: "W3Schools", url: "https://www.w3schools.com/js/js_htmldom_eventlistener.asp" },
      { title: "HTML DOM Events", provider: "W3Schools", url: "https://www.w3schools.com/js/js_htmldom_events.asp" },
      { title: "JavaScript Debugging", provider: "W3Schools", url: "https://www.w3schools.com/js/js_debugging.asp" },
    ],
  },
];

const assignments = [
  {
    weekNumber: 1,
    title: "Personal Introduction Webpage",
    description:
      "Create a personal introduction webpage containing a heading, paragraphs and a list.",
  },
  {
    weekNumber: 2,
    title: "Personal Profile Website",
    description:
      "Build a personal profile website with navigation, images, lists and a contact form.",
  },
  {
    weekNumber: 3,
    title: "Style Your Profile Website",
    description:
      "Style your Week 2 personal profile website using your own colour palette and typography.",
  },
  {
    weekNumber: 4,
    title: "Landing Page Design",
    description:
      "Create a landing page with a navigation bar, hero section and multiple content sections.",
  },
  {
    weekNumber: 5,
    title: "Responsive Landing Page",
    description:
      "Make your Week 4 landing page responsive across desktop, tablet and mobile devices.",
  },
  {
    weekNumber: 6,
    title: "JavaScript Calculator or Quiz",
    description:
      "Build a simple calculator or interactive quiz using JavaScript.",
  },
  {
    weekNumber: 7,
    title: "Student Directory",
    description:
      "Create a student directory that displays student names and information from an array of objects.",
  },
  {
    weekNumber: 8,
    title: "Final Web Development Project",
    description:
      "Build and present a complete interactive website that solves a problem or provides a useful service.",
  },
];

const seedCourse = async () => {
  try {
    await connectDB();

    // Create or update the course without creating duplicates.
    const course = await Course.findOneAndUpdate(
      { title: "Web Development" },
      {
        $set: {
          title: "Web Development",
          description:
            "Learn HTML, CSS and JavaScript step by step through practical projects and weekly assignments.",
          level: "Beginner",
          duration: "8 weeks",
          weeks,
          isPublished: true,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    console.log("Course saved successfully.");

    // Create or update all eight assignments.
    for (const item of assignments) {
      await Assignment.findOneAndUpdate(
        {
          course: course._id,
          weekNumber: item.weekNumber,
        },
        {
          $set: {
            course: course._id,
            weekNumber: item.weekNumber,
            title: item.title,
            description: item.description,
            instructions: [],
            points: 100,
            isPublished: true,
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );
    }

    console.log("All eight assignments saved successfully.");
    console.log("YouthForge curriculum is ready!");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedCourse();
