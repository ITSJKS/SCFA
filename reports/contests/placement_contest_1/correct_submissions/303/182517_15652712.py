def nextGreaterElement(arr):
    res = [-1]*(len(arr))
    stack = []
    for i in range(len(arr)):
        while(stack and arr[i]>arr[stack[-1]]):
            res[stack.pop()] = arr[i]
        stack.append(i)
    print(*res)