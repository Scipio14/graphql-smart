//Import modules
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

//Defining the Schema with SDL
const schema = buildSchema(`
  type Query{
    course(id:Int!):Course
    courses(topic:String!):[Course]
   
  }
  type Mutation{
    updateCourseTopic(id:Int!,topic:String!):Course
  }

  type Course{
    id:Int
    title:String
    author:String
    description:String
    topic:String,
    url:String


  }
`);

//Hardcoded data
const coursesData = [
  {
    id: 1,
    title: "The Complete Node.js Developer Course",
    author: "Andrew Mead, Rob Percival",
    description:
      "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs/",
  },
  {
    id: 2,
    title: "Node.js, Express & MongoDB Dev to Deployment",
    author: "Brad Traversy",
    description:
      "Learn by example building & deploying real-world Node.js applications from absolute scratch",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/",
  },
  {
    id: 3,
    title: "JavaScript: Understanding The Weird Parts",
    author: "Anthony Alicea",
    description:
      "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
    topic: "JavaScript",
    url: "https://codingthesmartway.com/courses/understand-javascript/",
  },
];
//Creating the resolver functions
const getCourse = (args) => {
  const id = args.id;
  return coursesData.filter((course) => {
    return course.id == id;
  })[0];
};

const getCourses = ({ topic }) => {
  if (topic) {
    return coursesData.filter((course) => course.topic === topic);
  } else {
    return coursesData;
  }
};
const updateCourseTopic = ({ id, topic }) => {
  coursesData.map((course) => {
    if (course.id === id) {
      course.topic = topic;
      return course;
    }
  });
  return coursesData.filter((course) => course.id === id)[0];
};

//Create the resolvers
const resolvers = {
  course: getCourse,
  courses: getCourses,
  updateCourseTopic: updateCourseTopic,
};

//Create the express and graphql server

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server is working");
});

//Listening the server on the giving port number
app.listen(666, () => console.log("Server running on port 666"));
