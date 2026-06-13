def nextGreaterElement(arr):
    ans = []
    for i in range (len(arr)):
        for j in range(i+1,len(arr)):
            if arr[j] > arr[i]:
                ans.append(arr[j])
                # print(ans)
                break
        if len(ans) != i+1:
            ans.append(-1)
    print(*ans)
    # return ans