def nextGreaterElement(arr):

    result = [-1]*len(arr)

    stack=[]
    for i in range(len(arr)):
        while stack and arr[stack[-1]]< arr[i]:
            
            result[stack[-1]]=arr[i]
            stack.pop()
        stack.append(i)    
    print(*result )