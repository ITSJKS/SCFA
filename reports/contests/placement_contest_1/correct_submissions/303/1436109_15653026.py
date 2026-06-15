def nextGreaterElement(arr):
    stack = []
    ans = []
    for i in range(len(arr)-1, -1, -1):
        while(stack and stack[-1] <= arr[i]):
            stack.pop()
        if(not stack):
            ans.append(-1)
        else:
            ans.append(stack[-1])
        stack.append(arr[i])
    print(*ans[::-1])