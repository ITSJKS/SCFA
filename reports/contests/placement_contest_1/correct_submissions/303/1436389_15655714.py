def nextGreaterElement(arr):
    ans  = [-1]*len(arr)
    stack =[]
    for i in range(len(arr)-1,-1,-1):
        while stack and stack[-1] <= arr[i]:
            stack.pop()
        if stack:
            ans[i]=stack[-1]
        stack.append(arr[i])
    # return ans
    print(*ans)