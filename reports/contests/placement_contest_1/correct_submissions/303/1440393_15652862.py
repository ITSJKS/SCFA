def nextGreaterElement(arr):
    ans = []
    for i in range(len(arr)):
        flag= False
        for j in range(i+1,len(arr)):
            
            if arr[j] > arr[i]:
                ans.append(arr[j])
                flag = True
                break
        if flag == True:
            continue
        else:
            ans.append(-1)
    print(*ans)