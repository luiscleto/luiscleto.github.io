// TODO: Add Athletic Skills, Office Skills,
// Data Engineering, Data Science, ML Engineering, ... ?

const skills = [
  {
    title: 'Go',
    competency: 5,
    category: ['Languages', 'Go'],
  },
  {
    title: 'Java',
    competency: 5,
    category: ['Languages', 'Java'],
  },
  {
    title: 'Javascript',
    competency: 3,
    category: ['Languages', 'Javascript'],
  },
  {
    title: 'Typescript',
    competency: 3,
    category: ['Languages', 'Typescript'],
  },
  {
    title: 'Bash',
    competency: 2,
    category: ['Tools', 'Languages'],
  },
  {
    title: 'SQL',
    competency: 4,
    category: ['Databases', 'Languages'],
  },
  {
    title: 'Git',
    competency: 4,
    category: ['Tools'],
  },
  {
    title: 'Kubernetes',
    competency: 2,
    category: ['Tools'],
  },
  {
    title: 'HTML + SASS/SCSS/CSS',
    competency: 2,
    category: ['Web Development', 'Languages'],
  },
  {
    title: 'Python',
    competency: 2,
    category: ['Languages', 'Python'],
  },
  {
    title: 'C/C++',
    competency: 2,
    category: ['Languages', 'C/C++'],
  },
  {
    title: 'Hadoop',
    competency: 2,
    category: ['Data Engineering', 'Data Science'],
  },
  {
    title: 'Spark',
    competency: 2,
    category: ['Data Engineering', 'Data Science'],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

// this is a list of colors that I like. The length should be == to the
// number of categories. Re-arrange this list until you find a pattern you like.
const colors = [
  '#6968b3',
  '#37b1f5',
  '#40494e',
  '#515dd4',
  '#e47272',
  '#cc7b94',
  '#3896e2',
  '#c3423f',
  '#d75858',
  '#747fff',
  '#64cb7b',
];

const categories = [
  ...new Set(skills.reduce((acc, { category }) => acc.concat(category), [])),
]
  .sort()
  .map((category, index) => ({
    name: category,
    color: colors[index],
  }));

export { categories, skills };
