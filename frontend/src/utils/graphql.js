import axios from 'axios';

const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:5001/graphql';

export const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(GRAPHQL_URL, {
      query,
      variables
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

