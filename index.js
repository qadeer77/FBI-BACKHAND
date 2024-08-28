const app = require('./src/app');
const passwordRoutes = require('./src/routes/userRoutes')

app.use('/', passwordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
