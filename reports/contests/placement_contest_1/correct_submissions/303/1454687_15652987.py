def nextGreaterElement(arr):
    n = len(arr)
    stack = []
    nge = [-1] * n 
    for i in range(n-1,-1,-1):
        while stack and stack[-1] <= arr[i]:
            stack.pop()
        if stack:
            nge[i] = stack[-1]
        stack.append(arr[i])
    print(*nge)