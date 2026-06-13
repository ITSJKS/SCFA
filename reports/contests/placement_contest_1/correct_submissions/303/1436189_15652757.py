def nextGreaterElement(arr):

    n=len(arr)
    stack=[]
    res=[-1]*n

    for i in range(n-1,-1,-1):
        while stack and arr[stack[-1]]<=arr[i]:
            stack.pop()
        
        if stack:
            res[i]=arr[stack[-1]]
        
        stack.append(i)
    
    print(*res)