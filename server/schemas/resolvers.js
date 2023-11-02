const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const user = await User
                    .findOne({ _id: context.user._id })
                    .select('-_v -password')
                
                return user;
            }
            throw new AuthenticationError("Must log in first!");
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            const token =signToken(user);
            if (!user) {
                throw new AuthenticationError("Incorrect login")
            }

            const correctPassword = await user.isCorrectPassword(password)
            if (!correctPassword) {
                throw new AuthenticationError("Incorrect login")
            }

            return { token, user }
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user }
        },

        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookData } },
                    { new: true },
                )
            
            return user
            }

            throw new AuthenticationError("You must be logged in")
        },

        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                )

            return user
            }

            throw new AuthenticationError("You must be logged in")
        }
    },
};

module.exports - resolvers;