def nextGreaterElement(arr):

    ng =[-1]*len(arr)
    stack =[]
    for i in range(len(arr)-1,-1,-1):
        while stack and stack[-1]<=arr[i]:
            stack.pop()
        
        if stack:
            ng[i] = stack[-1]
        stack.append(arr[i])
    
    print(*ng)