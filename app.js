//test
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    // console.log("test")
    // console.log(process)
    // console.log(process.env)
    // console.log(process.env.NODE_ENV)
    // console.log(process.env.DB_URL)
}

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground')
const methodOverride = require('method-override')

const app = express();
const path = require('path')
const dbURL = process.env.DB_URL  || 'mongodb://127.0.0.1:27017/yelp-camp'
console.log(`using this database: ${dbURL}`)




// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// } );

// mongoose.connect(dbURL,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// } );

mongoose.connect(dbURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
} );



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate)
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended : true }))
app.use(methodOverride('_method'));

app.get('/', (req,res) => {
//    res.send('hello from yelp camp')
    res.render('home')
})

app.get('/campgrounds', async(req,res) => {
    const campgrounds = await Campground.find({})
//    console.log(campgrounds)
//    res.send(campgrounds)
    res.render('campgrounds/index', {campgrounds})
})



app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    console.log("test")
    console.log(campground)
    res.redirect(`/campgrounds/${campground._id}`)
})


// app.post('/campgrounds', async(req,res) => {
// //    console.log(req.body)
//     const campgroundData = req.body.campground
//     const newCampground = new Campground(campgroundData)
//     await newCampground.save()
//     console.log(newCampground)
//     console.log("test do we get this far")
//     console.log(newCampground._id)
//     res.redirect(`campgrounds/${newCampground._id}`)
// })


app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new')
})

// app.get('/campgrounds/:id', async(req,res) => {
//     console.log("inside campgrounds id")
//     const {id} = req.params
//     console.log(`this is my id ${id}`)
//     const myCampground = await Campground.findById(id)
//     res.render('campgrounds/show',{campground:myCampground})
// })
app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    console.log("in show")
    console.log(campground)
    console.log("aftercampground")    
    res.render('campgrounds/show', { campground });
});


app.get('/campgrounds/:id/edit', async(req,res) => {
    const {id} = req.params
    const myCampground = await Campground.findById(id)
    res.render('campgrounds/edit',{campground:myCampground})
})

app.put('/campgrounds/:id', async(req,res) => {
    console.log(req.params)
    const {id} = req.params
    const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground},{new:true})
    res.redirect(`/campgrounds/${updatedCampground._id}`)
//    res.send("IT WORKED")
})

app.delete('/campgrounds/:id', async (req,res) => {
    console.log("Delete request sent")
    const {id} = req.params
    console.log(`id: ${id}`)
    //res.send(id)
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds/')
//    res.send("fubark")
})


app.get('/makecampground', async (req,res) => {
    //    res.send('hello from yelp camp')
    console.time('test-save')
    const newCampground = new Campground({title:'hello'})
    await newCampground.save()
    console.log(newCampground)
    console.log(console.timeEnd('test-save'))
    res.send(newCampground)
    })


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})