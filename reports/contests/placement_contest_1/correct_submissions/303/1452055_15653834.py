def nextGreaterElement(arr):
    stack  = [arr[-1]]
    ans = []
    res = [-1]*len(arr)
    # for i in (arr[-2::-1]):
    #     if len(stack)>0 and arr[i] < stack[-1]:
    #         stack.append(arr[i])
    #         ans.append(stack[-1])
    #         print(ans )
    #     while stack:
    #         if len(stack)> 0 and arr[i] < arr[stack[-1]]:
    #             stack.append(arr[i])
    #             ans.append(stack[-1])
    #             break 
    #         else:
    #             stack.pop()

    for i in range(len(arr)-1):
        for j in range(i+1,len(arr)):
            if arr[i] < arr[j]:
                res[i] = arr[j]
                break 
            else: 
                continue 
    
    print(*res)