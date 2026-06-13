def isPresent(n, nums, target):
    ans=-1
    s=0
    e=n-1
    while s<=e:
        mid=(s+e)//2
        if nums[mid]==target:
            ans=mid
            break
        elif nums[mid]>target:
            s=mid+1
        else:
            e=mid-1
    return ans