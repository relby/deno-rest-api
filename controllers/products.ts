import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts"
import { Product } from '../types.ts'
import { RouterContext } from 'https://deno.land/x/oak@v10.6.0/mod.ts'
import { dbCreds } from '../config.ts'

const client = new Client(dbCreds)

// @desc  Get all products
// @route GET /api/v1/products
export const getProducts = async ({response}: RouterContext<"/api/v1/products">) => {
  await client.connect()
  const { rows } = await client.queryObject<Product>("SELECT * FROM products;")
  response.status = 200
  response.body = {
    success: true,
    data: rows
  }
  await client.end()
}
// @desc  Get a single product
// @route GET /api/v1/products/:id
export const getProduct = async ({response, params}: RouterContext<"/api/v1/products/:id">) => {
  const id = +params.id
  await client.connect()
  const { rows } = await client.queryObject<Product>("SELECT * FROM products WHERE id = $1;", [id])
  const product = rows[0]
  if (!product) {
    response.status = 404
    response.body = {
      success: false,
      msg: "There is no product with that id"
    }
  } else {
    response.status = 200;
    response.body = {
      success: true,
      data: product
    }
  }
  await client.end()
}
// @desc  Add a single product
// @route POST /api/v1/products
export const addProduct = async ({request, response}: RouterContext<"/api/v1/products">) => {
  if (!request.hasBody) {
    response.status = 400
    response.body = {
      success: false,
      msg: "No data provided"
    }
    return
  }
  const body = request.body()
  const product = await body.value as Product
  await client.connect()

  await client.queryObject<Product>(
    "INSERT INTO products(name,description,price) VALUES($1,$2,$3);",
    [
      product.name,
      product.description,
      product.price
    ]
  )
  response.status = 200
  response.body = {
    success: true,
    data: product
  }
  await client.end()
}

// @desc  Update a single product
// @route PUT /api/v1/products/:id
export const updateProduct = async ({request, response, params}: RouterContext<"/api/v1/products/:id">) => {
  const id = +params.id;
  if (!request.hasBody) {
    response.status = 400
    response.body = {
      success: false,
      msg: "No data provided"
    }
    return
  }
  const body = request.body()
  const product = await body.value as Product

  await client.connect()
  await client.queryObject<Product>(
    `UPDATE products
     SET name = $1, description = $2, price = $3
     WHERE id = $4;`,
    [
      product.name,
      product.description,
      product.price,
      id
    ]
  )

  response.status = 200
  response.body = {
    success: true,
    data: product
  }
  await client.end()
}

// @desc  Delete a single product
// @route DELETE /api/v1/products/:id
export const deleteProduct = async ({response, params}: RouterContext<"/api/v1/products/:id">) => {
  const id = +params.id

  await client.connect()
  const {rows} = await client.queryObject<Product>(
    `SELECT * FROM products WHERE id = $1;`,
    [id]
  )
  const product = rows[0];
  if (!product) {
    response.status = 404
    response.body = {
      success: false,
      msg: "There is no such product with that id"
    }
    return
  }
  await client.queryObject<Product>(
    `DELETE FROM products
     WHERE id = $1;`,
    [id]
  )
  response.status = 200
  response.body = {
    success: true,
    data: product
  }
}