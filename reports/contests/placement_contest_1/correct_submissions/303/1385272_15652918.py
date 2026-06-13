def nextGreaterElement(arr):
    stack = []
    res = [-1]*len(arr)

    for i in range(len(arr)):
        while(stack and arr[stack[-1]] < arr[i]):
            idx = stack.pop()
            res[idx] = arr[i]

        stack.append(i)


    for i in res:
        print(i, end=" ")