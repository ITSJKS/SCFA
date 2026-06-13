def isPresent(n, nums, target):
    #write your code here
    l=0
    r=n-1
    ans=-1
    while(l<=r):
        mid=(l+r)//2
        if(nums[mid]==target):
            ans=(mid)
            break
        elif(nums[mid]>target):
            l=mid+1
        else:
            r=mid-1
    return(ans)