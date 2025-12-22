const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const crypto = require("crypto");
// Middleware
app.use(cors());
app.use(express.json());

// Firebase admin setup
const admin = require("firebase-admin");
const decoded = Buffer.from(process.env.FB_KEY, "base64").toString("utf-8");
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Verify Firebase Token
const verifyToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }
  const token = authorization.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded_email = decoded.email;
    next();
  } catch (err) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }
};

// Home Route
app.get("/", (req, res) => {
  res.send("hello mission scic");
});

// MongoDB
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.dm91gwq.mongodb.net/?appName=Cluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("missionscic11");
    const userColl = database.collection("users");
    const requestColl = database.collection("requests");
    const payColl = database.collection("payments");

    /* ============================
                USERS
       ============================ */

    // Dashboard Stats
  app.get("/dashboard/stats", verifyToken, async (req, res) => {
  const totalDonors = await userColl.countDocuments({ role: "donor" });
  const totalRequests = await requestColl.countDocuments();

  // calculate total funding
  const payments = await payColl.find().toArray();
  const totalFunding = payments.reduce((sum, p) => sum + p.amount, 0);

  res.send({
    totalDonors,
    totalRequests,
    totalFunding,
  });
});


    // CREATE USER
    app.post("/users", async (req, res) => {
      const user = req.body;
      user.createdAt = new Date();
      user.role = "donor";
      user.status = "active";

      const result = await userColl.insertOne(user);
      res.send(result);
    });

    // GET ALL USERS
    app.get("/users", verifyToken, async (req, res) => {
      const result = await userColl.find().toArray();
      res.send(result);
    });

    // UPDATE USER ROLE/STATUS
    app.patch("/users/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;

      const result = await userColl.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      res.send(result);
    });

    // UPDATE USER BY EMAIL
    app.patch("/users/update/:email", async (req, res) => {
      const email = req.params.email;
      const updateData = req.body;

      if (updateData._id) delete updateData._id;

      const result = await userColl.updateOne(
        { email: email },
        { $set: updateData }
      );

      res.send(result);
    });

    // GET USER ROLE
    app.get("/users/role/:email", async (req, res) => {
      const { email } = req.params;
      const result = await userColl.findOne({ email: email });
      res.send(result || { role: null, status: null });
    });

    /* ============================
              REQUESTS
       ============================ */

    // CREATE REQUEST
    app.post("/requests", verifyToken, async (req, res) => {
      const request = req.body;
      request.createdAt = new Date();

      const result = await requestColl.insertOne(request);
      res.send(result);
    });

    // GET ALL PENDING REQUESTS (PUBLIC)
    app.get("/requests/pending", async (req, res) => {
      try {
        const query = { donationStatus: "pending" };
        const result = await requestColl.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.log("🔥 ERROR IN /requests/pending => ", error);
        res.status(500).send({ message: "Server Error", error });
      }
    });

    // GET SINGLE REQUEST
    app.get("/requests/:id", async (req, res) => {
      const { id } = req.params;

      const result = await requestColl.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // GET USER REQUESTS + PAGINATION + FILTER (Donor Page)
    app.get("/requests/user/:email", async (req, res) => {
      const email = req.params.email;

      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 10;
      const status = req.query.status || "all";

      const query = { requesterEmail: email };

      if (status !== "all") {
        query.donationStatus = status;
      }

      const total = await requestColl.countDocuments(query);

      const result = await requestColl
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .toArray();

      res.send({ total, result });
    });

    // GET ALL REQUESTS (Admin + Volunteer Page)
    app.get("/requests", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;
        const status = req.query.status || "all";

        const query = {};

        if (status !== "all") {
          query.donationStatus = status;
        }

        const total = await requestColl.countDocuments(query);

        const result = await requestColl
          .find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * size)
          .limit(size)
          .toArray();

        res.send({ total, result });
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: true, message: "Server Error" });
      }
    });

    // DELETE REQUEST (Admin Only)
    app.delete("/requests/:id", async (req, res) => {
      const id = req.params.id;

      const result = await requestColl.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // UPDATE REQUEST STATUS (Admin + Volunteer)
    app.patch("/requests/update-status/:id", async (req, res) => {
      const id = req.params.id;
      const { donationStatus } = req.body;

      const result = await requestColl.updateOne(
        { _id: new ObjectId(id) },
        { $set: { donationStatus } }
      );

      res.send(result);
    });

    // UPDATE REQUEST FULL DATA (Admin + Donor)
    app.patch("/requests/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;

      if (updateData._id) delete updateData._id;

      const result = await requestColl.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      res.send(result);
    });
    app.get("/donors", async (req, res) => {
      try {
        const { bloodGroup, district, upazila } = req.query;

        const query = {};
        if (!query) return;
        if (bloodGroup) {
          const fixed = bloodGroup.replace(/ /g, "+").trim();
          query.blood = fixed;
        }
        if (district) {
          query.district = district.trim();
        }
        if (upazila) {
          query.subDistrict = upazila.trim();
        }

        console.log("=== QUERY ===");
        console.log(query);

        const donors = await userColl.find(query).toArray();

        console.log("=== RESULT ===", donors.length);

        res.send(donors);
      } catch (error) {
        console.log(error);
        res.status(500).send([]);
      }
    });

    // STRIPE PAYMENT INTENT
    app.post("/create-payment-checkout", async (req, res) => {
      const info = req.body;
      const amount = parseInt(info.donateAmount) * 100;

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: amount,
              product_data: {
                name: "Donation to Mission SCIC",
                description: `Donation from ${info.donorName} (${info.donorEmail})`,
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          donorName: info.donorName,
        },
        customer_email: info.donorEmail,
        success_url: `${process.env.SITE_DOMAIN}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_DOMAIN}/donation-cancel`,
      });
      res.send({ url: session.url });
    });

    app.post('/payment-success',async(req,res)=>{
      const {session_id}=req.query;
      const session=await stripe.checkout.sessions.retrieve(session_id);
      const transactionId=session.payment_intent;
      if(session.payment_status ==='paid'){
        const paymentInfo={
          amount:session.amount_total /100,
          currency:session.currency,
          transactionId,
          donorEmail:session.customer_email,
          payment_status:session.payment_status,
          donorName:session.metadata.donorName,
          paidAt:new Date()
        }
        const result=await payColl.insertOne(paymentInfo); 
        return res.send({success:true,message:'Payment recorded',result});
      }

      // Save donation info to database
      await donationColl.insertOne({
        donorName,
        donorEmail,
        amount,
        createdAt: new Date(),
        status: "completed"
      });

      res.send({ success: true });
    });

    // DB CONNECT STATUS CHECK
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected ✔️");
  } finally {
  }
}

run().catch(console.dir);

// Server start
app.listen(port, () => {
  console.log(`server is running http://localhost:${port}`);
});
