const express = require('express'),
    router = express.Router(),
    Product = require('../models/ProductSchema'),
    { check, validationResult } = require('express-validator'),
    multer = require('multer');

// @route   POST /Products
// @desc    Create new product or update existing
// @access  Public

router.post('/:id?', [
    check('name', 'Name is required')
        .not().isEmpty(),
    check('price', 'Price is required')
        .not().isEmpty()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            price,
            size,
            brand,
            era,
            width,
            lngth,
            description,
            imageName,
            imageData,
            available,
            quantity
        } = req.body;

        //Build product object

        const productFields = {};
        productFields.name = name;
        productFields.price = price;
        if (size) productFields.size = size;
        if (brand) productFields.brand = brand;
        if (era) productFields.era = era;
        if (width) productFields.width = width;
        if (lngth) productFields.lngth = lngth;
        if (description) productFields.description = description;
        if (imageData) productFields.imageData = imageData;
        if (imageName) productFields.imageName = imageName;
        if(available) productFields.available = available;
        if(quantity) productFields.quantity = quantity;
        try {

            let product = await Product.findOne({ _id: req.params.id });

            if (product) {
                //update

                product = await Product.findOneAndUpdate(
                    { _id: req.params.id },
                    { $set: productFields },
                    { new: true }

                );
                return res.json(product);
            }

            //Create
            product = new Product(productFields);
            await product.save();
            res.json(product);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);
// @route    GET /Products
// @desc     Get all products
// @access   Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET Products/:product_id/
// @desc     Get product by product id
// @access   Public
router.get('/:product_id', async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.product_id
        });

        if (!product) return res.status(400).json({ msg: 'Product not found' });

        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    DELETE /Products
// @desc     Delete product
// @access   Private
router.delete('/:product_id', async (req, res) => {
    try {

        await Product.findOneAndRemove({ _id: req.params.product_id });

        res.json({ msg: 'Product deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/*MiddleWare for image upload */
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'./uplads/');
    },
    filename: (req,file,cb) => {
        cb(null,Date.now() + file.originalname);
    }
});

fileFilter = (feq,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    } else{
        cb(null,false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
module.exports = router;