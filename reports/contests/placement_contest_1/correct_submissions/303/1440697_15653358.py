def nextGreaterElement(arr):
    stack = []
    res = []
    for i in range(len(arr)-1,-1,-1):
        if len(res) == 0:
            res.append(-1)
        elif arr[i] < stack[-1]:
            res.append(stack[-1])
        else:
            while stack and arr[i] >= stack[-1]:
                stack.pop()
            if len(stack) == 0:
                res.append(-1)
            else:
                res.append(stack[-1])
        stack.append(arr[i])
    for i in range(len(res)-1,-1,-1):
        print(res[i], end=" ")