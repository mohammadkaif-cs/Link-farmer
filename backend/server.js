const express = require('express');
const mongoose = require('mongoose');
const validator=require('validator');
const becrypt=require("bcryptjs");
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto');
// const bodyParser = require('body-parser');
const cors = require('cors');
const { type } = require('os');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = "LinkfarmerAuth";

app.use(cors({origin: 'http://localhost:5173'}));
// app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Linkfarmer'
).then(()=>{
    console.log("connection oriented");
}).catch((error)=>{
    console.log("connection Invalid")
});


function validatePassword(value) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value);
}

function generateToken(userEmail) {
  return jwt.sign({ id: userEmail._id, email: userEmail.email }, JWT_SECRET, { expiresIn: '30d' });
}




const userSchema = new mongoose.Schema({
  fullName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:[true,"email is already logged in"],
    validate: {
        validator: function(v) {
            return validator.isEmail(v); 
        },
        message: props => `${props.value} is not a valid email address!`,
  }},
  phoneNumber:{
    type:Number,
    required:true,
    unique:[true,"Already Available"]
  },
  address:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true,
    unique:[true,"Already Present"],
    validate: {
        validator: function(v) {
            return validatePassword(v);
        },
        message: 'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.'
    }
  },
  confirmPassword:{
    type:String,
    // required:true
  },
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  }

  });



  

  userSchema.pre("save", async function securePass(next) {
    if (this.isModified("password")) {
        this.password = await becrypt.hash(this.password, 10)
  
        this.confirmpassword = undefined;
    }

    next();
  })


  

const User = mongoose.model('User', userSchema);

const newContactSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    trim:true
  },
  message:{
    type:String,
    required:true,
    trim:true
  }
});

const Newcontact = mongoose.model("Newcontact",newContactSchema);

const sellingProducts= new mongoose.Schema({
  productName:{
    type:String,
    required:true,
    trim:true
  },
  productCategory:{
    type:String,
    required:true,
    trim:true
  },
  productDescription:{
    type:String,
    required:true,
    trim:true
  },
  productPrice:{
    type:String,
    required:true,
    trim:true
  },
  productQuantity:{
    type:String,
    required:true,
    trim:true
  },
  phoneNumber:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    trim:true
  }

});

const Selling = mongoose.model("Selling",sellingProducts);


//here my register page api call starts
app.post('/api/register', async (req, res) => {
  try {
   
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    if(password === confirmPassword){
      const myRegis=new User({
        fullName:req.body.fullName,
        email:req.body.email,
        phoneNumber:req.body.phoneNumber,
        address:req.body.address,
        password:req.body.password,
     })
     await myRegis.save();
     res.status(201).send('User registered');
    console.log(myRegis)

    } else{
      res.send("password do not match")
    }
   
    
  } catch (error) {
    res.status(400).send('Error registering user');
    console.log(error)
  }
});
//here my register api calls ends

//here my login api calls starts
app.post("/api/login",async(req,res)=>{
  const {email,password}= req.body;
  try {
    const userEmail= await User.findOne({email})
    const isMatch=await becrypt.compare(password, userEmail.password);
    if(isMatch){
      res.status(201)
      const token = await generateToken(userEmail);
      return res.send({ token:token });
      
    }else{
      res.status(401).send("Invalid Password")
    }
    
  } catch (error) {
    res.status(501).json("Invalid Email")
  }
})

// here is my api call for contact us
app.post("/api/contact", async(req,res)=>{
  try {
    const allContacts= new Newcontact({
      name:req.body.name,
      email:req.body.email,
      message:req.body.message
    });
    if(!allContacts){
      res.status(400).json("Some Problem Ocuured")
    }
    await allContacts.save();
    res.status(201).json("Submitted Successfully")


  } catch (error) {
    console.error(error)
  }
});
//here my contactUs page api call ends

//here my selling options api call started
app.post("/api/selling", async(req,res)=>{
  try {

    const ourSelling= new Selling({
      productName:req.body.productName,
      productCategory:req.body.productCategory,
      productDescription:req.body.productDescription,
      productPrice:req.body.productPrice,
      productQuantity:req.body.productQuantity,
      phoneNumber:req.body.phoneNumber,
      email:req.body.email
    });

    if(!ourSelling){
      res.status(400).json("Invalid")
    }

    await ourSelling.save();
    res.status(201).json("Submitted Successfull")
    
  } catch (error) {
    console.error(error);
    res.status(500).json("Problem occured")
  }
})
//here my selling options api call ends


// Order schema
const orderSchema = new mongoose.Schema({
  userId: String,
  items: [{
      productId: String,
      quantity: Number,
      price: Number
  }],
  totalPrice: String,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);


app.post('/api/orders', async (req, res) => {
  const { userId, items, paymentMethod } = req.body;

  // Calculate total price
  let totalPrice =items.quantity*items.price;
 let rice=totalPrice.toString();

  // Create a new order
  const order = new Order({ userId, items, rice, paymentMethod });
  await order.save();

  res.status(201).json({ message: 'Order created successfully', orderId: order._id });
});




//here is my listining to the port server starts

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
