import { gql, useQuery } from '@apollo/client'
import { User } from '../models/User'
import { graphql } from '../gql'

const getMeDocument = graphql(`
  query Me {
    me {
      _id
      email
    }
  }
`)

const useGetMe = () => {
  return useQuery<{ me: User }>(getMeDocument)
}

export { useGetMe }
