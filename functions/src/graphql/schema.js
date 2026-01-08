const { gql } = require('apollo-server-cloud-functions');

const typeDefs = gql`
  type Vehicle {
    id: ID!
    title: String!
    make: String!
    model: String!
    year: Int!
    price: Float!
    images: [String!]!
    description: String
    mileage: Int
    color: String
    fuelType: String
    transmission: String
    createdAt: String
    updatedAt: String
  }

  input VehicleInput {
    title: String!
    make: String!
    model: String!
    year: Int!
    price: Float!
    images: [String!]!
    description: String
    mileage: Int
    color: String
    fuelType: String
    transmission: String
  }

  input VehicleFilter {
    search: String
    year: Int
    make: String
    minYear: Int
    maxYear: Int
  }

  type Query {
    vehicles(filter: VehicleFilter): [Vehicle!]!
    vehicle(id: ID!): Vehicle
    makes: [String!]!
    years: [Int!]!
  }

  type Mutation {
    createVehicle(input: VehicleInput!): Vehicle!
  }
`;

module.exports = typeDefs;

