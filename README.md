# ACM Build (TypeScript)

`acm-build-ts` is a tool designed to construct data for regular ACM competition problems.

You can use TypeScript to describe the input, and use your own C++ code to solve the problem.

The tool takes your TypeScript input generator, the `std.cpp` file and some fixed input files. It then automatically compiles the C++ code and gives you a `data.zip` file, containing all the input and output files.

A sample problem is put in the `problems/sample` directory. Try `$ tsx problems/sample/build.ts`.
