def nextGreaterElement(arr):
    stack = []
    ans = []

    i = len(arr) - 1
    while (i >= 0):
        while stack and (stack[-1] <= arr[i]):
            stack.pop()
        
        if stack:
            ans.append(stack[-1])
        else:
            ans.append(-1)
        
        stack.append(arr[i])

        i -= 1

    for i in range(len(arr) - 1, -1, -1):
        print(ans[i], end = " ")