def nextGreaterElement(arr):
    stack = []
    idx = 0
    cnt=0
    i = 1
    while idx<len(arr):
        if i>=len(arr):
            break
        if arr[i]>arr[idx] :
            # print("great",arr[i],arr[idx])
            stack.append(arr[i])
            idx+=1
            i+=1
        else:
            # print("lowe",arr[i],arr[idx])
            found = False
            while arr[idx]>=arr[i]:
                if i>=len(arr)-1:
                    found = False
                    break
                i+=1
                found = True
            if found:
                stack.append(arr[i])
                idx+=1
            else:
                stack.append(-1)
                idx+=1
            i=idx+1
        if i==len(arr):
            stack.append(-1)
    print(*stack)
    return