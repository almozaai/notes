const Sequelize = require("sequelize");
const { STRING, BOOLEAN, UUID, UUIDV4, DATE } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/notes_db"
);

const uudiDefinition = {
  type: UUID,
  defaultValue: UUIDV4,
  primaryKey: true
};

const User = conn.define("user", {
  id: uudiDefinition,
  name: {
    type: STRING,
    allowNull: false,
    unique: true
  }
});

const Note = conn.define("note", {
  id: uudiDefinition,
  title: {
    type: STRING,
    allowNull: false
  },
  description: {
    type: STRING,
    allowNull: false
  },
  date: {
    type: DATE
  }
});

const Category = conn.define("category", {
  id: uudiDefinition,
  name: {
    type: STRING,
    allowNull: false,
    unique: true
  }
});

Category.belongsTo(User);
User.hasMany(Category);

Note.belongsTo(Category);
Category.hasMany(Note);

const mapPromise = (items, model) =>
  Promise.all(items.map(item => model.create(item)));

const syncAndSeed = async () => {
  await conn.sync({ force: true });

  const users = [{ name: "Saleh" }, { name: "Adrian" }];

  const [Saleh, Adrian] = await mapPromise(users, User);

  const categories = [
    { name: "Home", userId: Saleh.id },
    { name: "Work", userId: Saleh.id },
    { name: "Personal", userId: Adrian.id }
  ];

  const [Home, Work, Personal] = await mapPromise(categories, Category);

  const notes = [
    {
      title: "first meeting",
      description: "With neww custome",
      date: "3/20/2020",
      categoryId: Home.id
    },
    {
      title: "Second meeting",
      description: "for first product",
      date: "3/20/2020",
      categoryId: Work.id
    },
    {
      title: "Third meeting",
      description: "With neww custome",
      date: "3/20/2020",
      categoryId: Personal.id
    }
  ];

  const [note1, note2, note3] = await mapPromise(notes, Note);
};

module.exports = {
  syncAndSeed,
  models: {
    User,
    Category,
    Note
  }
};
