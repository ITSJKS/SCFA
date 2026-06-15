def nextGreaterElement(arr):
    for i in range(len(arr)-1):
        j=i+1
        a=True
        while arr[i]>=arr[j]:
            if j<len(arr)-1:
                j+=1
            else:
                a=False
                break
        if not a:
            print(-1,end=" ")
        else:
            print(arr[j],end=" ")
    print(-1)