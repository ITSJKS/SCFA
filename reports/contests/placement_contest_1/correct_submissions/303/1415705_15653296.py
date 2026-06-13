def nextGreaterElement(arr):
    N = len(arr)
    # stack = [-1] * N
    # ans = []

    # for i in range(N):
    #     while stack and arr[i] > arr[stack[-1]]:
    #         elem = ans.pop()
    #         stack[elem] = arr[i]
    #     ans.append(i)
    # print(stack)      

    ans = []
    for i in range(N):
        for j in range(i, N):
            if arr[i] < arr[j]:
                ans.append(arr[j])
                break
        else:
            ans.append(-1)        
  
    print(*ans)             





















    # stack = [-1] * (len(arr))
    # ans = []

    # for i in range(len(arr)):

    #     while stack and arr[i] > arr[stack[-1]]:
    #         elem = stack.pop()
    #         stack[elem] = arr[i]
    #     ans.append(i)

    # print(stack)