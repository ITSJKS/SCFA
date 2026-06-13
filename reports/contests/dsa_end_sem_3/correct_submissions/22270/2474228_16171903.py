def isPresent(n, arr, target):
    start=0
    end=n-1
    ans=-1
    while start<=end:
        mid=(start+end)//2
        if(arr[mid]==target):
            ans=mid
            break
        elif(arr[mid]<target):
            end=mid-1
        else:
            start=mid+1
    return ans