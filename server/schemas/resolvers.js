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
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            const token =signToken(user);
            if (!user) {
            }

            const correctPassword = await user.isCorrectPassword(password)
            if (!correctPassword) {
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

        }
    },
};

module.exports = resolvers;